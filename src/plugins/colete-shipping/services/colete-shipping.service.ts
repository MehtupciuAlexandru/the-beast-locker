import { Injectable } from '@nestjs/common';
import { ActiveOrderService, ID, Logger, Order, OrderService, RequestContext } from '@vendure/core';
import { ColeteOnlineClient, ColeteShippingPointsResponse } from './colete-online.client';

const loggerCtx = 'ColeteShippingService';
const FREE_SHIPPING_THRESHOLD = 29900;

type OrderCustomFields = {
    coletePackageWeightKg?: number | null;
    coletePackageLengthCm?: number | null;
    coletePackageWidthCm?: number | null;
    coletePackageHeightCm?: number | null;
    coletePackageCount?: number | null;
    coletePackageContent?: string | null;
    coleteAwb?: string | null;
    coleteUniqueId?: string | null;
    coleteCourierName?: string | null;
    coleteServiceName?: string | null;
    coleteEstimatedPickupDate?: string | null;
    coleteAwbStatus?: string | null;
    coleteAwbError?: string | null;
    coleteDeliveryType?: string | null;
    coleteCheckoutPriceWithTax?: number | null;
    coleteCheckoutPriceWithoutTax?: number | null;
    coleteCheckoutCourierName?: string | null;
    coleteCheckoutServiceName?: string | null;
    coleteCheckoutServiceId?: number | null;
    coleteCheckoutActivationId?: string | null;
    coleteShippingPointId?: number | null;
    coleteShippingPointName?: string | null;
    coleteShippingPointType?: string | null;
    coleteShippingPointAddress?: string | null;
    coleteShippingPointLat?: number | null;
    coleteShippingPointLng?: number | null;
    coleteShippingPointCounty?: string | null;
    coleteShippingPointDistanceKm?: number | null;
};

type ColeteCheckoutSelectionInput = {
    deliveryType: 'address' | 'locker';
    priceWithTax: number;
    priceWithoutTax?: number | null;
    courierName?: string | null;
    serviceName?: string | null;
    serviceId?: number | null;
    activationId?: string | null;
    shippingPointId?: number | null;
    shippingPointName?: string | null;
    shippingPointType?: string | null;
    shippingPointAddress?: string | null;
    shippingPointLat?: number | null;
    shippingPointLng?: number | null;
    shippingPointCounty?: string | null;
    shippingPointDistanceKm?: number | null;
};

@Injectable()
export class ColeteShippingService {
    constructor(
        private orderService: OrderService,
        private activeOrderService: ActiveOrderService,
        private coleteClient: ColeteOnlineClient,
    ) {}

    async getCheckoutAddressQuote(ctx: RequestContext) {
        const order = await this.activeOrder(ctx);
        const payload = await this.buildColetePricePayload(order, 'address');
        const result = await this.coleteClient.getPrice(payload);
        const selected = this.addressPriceItem(result);
        this.logAddressPriceResult(order, payload.service, result, selected);

        if (!selected?.price?.total || !selected.service) {
            throw new Error('Colete Online did not return a usable direct-to-address delivery price.');
        }

        return this.priceItemToQuote('address', selected);
    }

    async getCheckoutShippingPoints(ctx: RequestContext) {
        const order = await this.activeOrder(ctx);
        const recipient = await this.recipient(order, 'priceMinimal');
        const county = recipient.address.countyCode ?? recipient.address.county;
        const payload = await this.buildColeteShippingPointsPayload(order, recipient);
        const result = await this.coleteClient.getShippingPoints(county, payload);

        return (result.points ?? [])
            .map(point => this.shippingPointToQuote(county, point))
            .filter(point => !!point)
            .sort((a, b) => a.priceWithTax - b.priceWithTax || (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    async setCheckoutSelection(ctx: RequestContext, input: ColeteCheckoutSelectionInput) {
        const order = await this.activeOrder(ctx);

        if (input.deliveryType === 'locker' && !input.activationId) {
            throw new Error('A locker selection must include the Colete service activation ID.');
        }

        const customFields = order.customFields as OrderCustomFields;
        const coletePriceWithTax = this.moneyToMinorUnits(input.priceWithTax);
        const coletePriceWithoutTax = input.priceWithoutTax == null ? null : this.moneyToMinorUnits(input.priceWithoutTax);
        const hasFreeShipping = order.subTotalWithTax > FREE_SHIPPING_THRESHOLD;

        return this.orderService.updateCustomFields(ctx, order.id, {
            ...customFields,
            coleteDeliveryType: input.deliveryType,
            coleteCheckoutPriceWithTax: hasFreeShipping ? 0 : coletePriceWithTax,
            coleteCheckoutPriceWithoutTax: hasFreeShipping ? 0 : coletePriceWithoutTax,
            coleteCheckoutCourierName: input.courierName ?? null,
            coleteCheckoutServiceName: input.serviceName ?? null,
            coleteCheckoutServiceId: input.serviceId ?? null,
            coleteCheckoutActivationId: input.activationId ?? null,
            coleteShippingPointId: input.shippingPointId ?? null,
            coleteShippingPointName: input.shippingPointName ?? null,
            coleteShippingPointType: input.shippingPointType ?? null,
            coleteShippingPointAddress: input.shippingPointAddress ?? null,
            coleteShippingPointLat: input.shippingPointLat ?? null,
            coleteShippingPointLng: input.shippingPointLng ?? null,
            coleteShippingPointCounty: input.shippingPointCounty ?? null,
            coleteShippingPointDistanceKm: input.shippingPointDistanceKm ?? null,
        });
    }

    async validateAddress(input: {
        fullName?: string;
        phoneNumber?: string;
        streetLine1?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        countryCode?: string;
    }) {
        const phone = this.normalizedPhone(input.phoneNumber);
        if (!phone) {
            return {
                valid: false,
                message: 'Numarul de telefon trebuie sa fie un numar mobil romanesc valid.',
            };
        }

        if (!input.fullName?.trim() || !input.streetLine1?.trim() || !input.city?.trim() || !input.province?.trim()) {
            return {
                valid: false,
                message: 'Completati numele, strada, orasul si judetul/sectorul.',
            };
        }

        const postalCode = input.postalCode?.replace(/\D/g, '') ?? '';
        if (!/^\d{6}$/.test(postalCode)) {
            return {
                valid: false,
                message: 'Codul postal trebuie sa contina exact 6 cifre.',
            };
        }

        try {
            const city = this.requiredOrderString(input.city, 'Order shipping city');
            const street = this.requiredOrderString(input.streetLine1, 'Order shipping street');
            const reverse = await this.coleteClient.getPostalCodeReverse(input.countryCode ?? 'RO', postalCode);
            const locality = reverse.locality;

            if (typeof locality !== 'object' || !locality?.city || !locality?.county) {
                return {
                    valid: false,
                    message: 'Codul postal nu poate fi asociat cu un oras si judet valid in Colete Online.',
                };
            }

            const normalizedCity = this.normalizeAddressText(locality.city);
            const inputCity = this.normalizeAddressText(city);
            if (normalizedCity !== inputCity) {
                return {
                    valid: false,
                    message: `Codul postal apartine localitatii ${locality.city}.`,
                };
            }

            const normalized = {
                city: locality.city.trim(),
                county: locality.county.trim(),
                countyCode: reverse.countyCode,
                street: this.bestMatchingStreet(street, reverse.street) ?? street,
            };

            return {
                valid: true,
                city: normalized.city,
                county: normalized.county,
                countyCode: normalized.countyCode,
                street: normalized.street,
                phoneNumber: phone,
            };
        } catch (error) {
            return {
                valid: false,
                message: error instanceof Error ? error.message : 'Adresa nu poate fi validata pentru Colete Online.',
            };
        }
    }

    async generateAwb(ctx: RequestContext, orderId: ID) {
        const order = await this.orderService.findOne(ctx, orderId, ['customer']);
        if (!order) {
            throw new Error(`Order ${orderId} was not found.`);
        }

        if (process.env.COLETE_AWB_GENERATION_ENABLED === 'false') {
            const message = 'Colete Online AWB generation is disabled by COLETE_AWB_GENERATION_ENABLED=false.';
            const updatedOrder = await this.orderService.updateCustomFields(ctx, order.id, {
                ...(order.customFields as OrderCustomFields),
                coleteAwbStatus: 'disabled',
                coleteAwbError: message,
            });

            return {
                success: false,
                message,
                awb: null,
                uniqueId: null,
                courierName: null,
                serviceName: null,
                estimatedPickupDate: null,
                order: updatedOrder,
            };
        }

        try {
            const payload = await this.buildColeteOrderPayload(order);
            const result = await this.coleteClient.createOrder(payload);
            const service = result.service?.service;
            const estimatedPickupDate = result.estimatedPickupDate ?? result.estimatedPickUpDate ?? null;

            const updatedOrder = await this.orderService.updateCustomFields(ctx, order.id, {
                ...(order.customFields as OrderCustomFields),
                coleteAwb: result.awb ?? null,
                coleteUniqueId: result.uniqueId ?? null,
                coleteCourierName: service?.courierName ?? null,
                coleteServiceName: service?.displayName ?? service?.name ?? null,
                coleteEstimatedPickupDate: estimatedPickupDate,
                coleteAwbStatus: 'generated',
                coleteAwbError: null,
            });

            return {
                success: true,
                message: 'AWB generated through Colete Online staging.',
                awb: result.awb ?? null,
                uniqueId: result.uniqueId ?? null,
                courierName: service?.courierName ?? null,
                serviceName: service?.displayName ?? service?.name ?? null,
                estimatedPickupDate,
                order: updatedOrder,
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown Colete Online error';
            const updatedOrder = await this.orderService.updateCustomFields(ctx, order.id, {
                ...(order.customFields as OrderCustomFields),
                coleteAwbStatus: 'error',
                coleteAwbError: message,
            });

            return {
                success: false,
                message,
                awb: null,
                uniqueId: null,
                courierName: null,
                serviceName: null,
                estimatedPickupDate: null,
                order: updatedOrder,
            };
        }
    }

    private async buildColeteOrderPayload(order: Order) {
        const customFields = order.customFields as OrderCustomFields;
        const packageCount = customFields.coletePackageCount ?? 1;
        const parcel = {
            weight: this.requiredNumber(customFields.coletePackageWeightKg, 'Package weight'),
            length: this.requiredNumber(customFields.coletePackageLengthCm, 'Package length'),
            width: this.requiredNumber(customFields.coletePackageWidthCm, 'Package width'),
            height: this.requiredNumber(customFields.coletePackageHeightCm, 'Package height'),
        };

        return {
            sender: this.sender(),
            recipient: await this.recipient(order),
            packages: {
                type: 2,
                content: customFields.coletePackageContent || 'Sport equipment',
                list: Array.from({ length: packageCount }, () => parcel),
            },
            service: this.serviceSelection(order),
            extraOptions: [],
        };
    }

    private async buildColetePricePayload(order: Order, deliveryType: 'address' | 'locker') {
        const recipient = await this.recipient(order, 'priceMinimal');

        return {
            sender: this.sender('priceMinimal'),
            recipient,
            packages: this.checkoutPackages(),
            service:
                deliveryType === 'locker'
                    ? this.lockerServiceSearch()
                    : this.addressServiceSearch(),
            extraOptions: [],
        };
    }

    private async buildColeteShippingPointsPayload(order: Order, recipient: any) {
        return {
            sender: this.sender('priceMinimal'),
            recipient,
            packages: this.checkoutPackages(),
            service: this.lockerServiceSearch(),
            extraOptions: [],
        };
    }

    private sender(validationStrategyOverride?: string) {
        const addressId = process.env.COLETE_SENDER_ADDRESS_ID;
        if (addressId) {
            return { addressId: Number(addressId) };
        }

        if (process.env.COLETE_USE_DUMMY_SENDER === 'true') {
            if (process.env.COLETE_ONLINE_ENV === 'production') {
                throw new Error('COLETE_USE_DUMMY_SENDER cannot be used in production.');
            }

            return {
                contact: {
                    name: 'Colete Staging Sender',
                    phone: '0722222222',
                    email: 'test@example.com',
                    company: 'Beast Locker Test',
                },
                address: {
                    countryCode: 'RO',
                    postalCode: '030167',
                    city: 'Bucuresti',
                    county: 'Bucuresti',
                    street: 'Lipscani',
                    number: '1',
                    additionalInfo: 'Dummy sender used only for staging tests.',
                },
                validationStrategy: validationStrategyOverride ?? 'minimal',
            };
        }

        return {
            contact: {
                name: this.requiredEnv('COLETE_SENDER_NAME'),
                phone: this.requiredEnv('COLETE_SENDER_PHONE'),
                email: this.requiredEnv('COLETE_SENDER_EMAIL'),
                company: process.env.COLETE_SENDER_COMPANY,
            },
            address: {
                countryCode: process.env.COLETE_SENDER_COUNTRY_CODE ?? 'RO',
                postalCode: this.requiredEnv('COLETE_SENDER_POSTAL_CODE'),
                city: this.requiredEnv('COLETE_SENDER_CITY'),
                county: this.requiredEnv('COLETE_SENDER_COUNTY'),
                street: this.requiredEnv('COLETE_SENDER_STREET'),
                number: this.requiredEnv('COLETE_SENDER_NUMBER'),
                building: process.env.COLETE_SENDER_BUILDING,
                entrance: process.env.COLETE_SENDER_ENTRANCE,
                floor: process.env.COLETE_SENDER_FLOOR,
                apartment: process.env.COLETE_SENDER_APARTMENT,
                additionalInfo: process.env.COLETE_SENDER_ADDITIONAL_INFO,
            },
            validationStrategy: validationStrategyOverride ?? process.env.COLETE_SENDER_VALIDATION_STRATEGY,
        };
    }

    private async recipient(order: Order, validationStrategyOverride?: string) {
        const address = order.shippingAddress;
        const customer = order.customer;
        const customFields = order.customFields as OrderCustomFields;

        if (!address) {
            throw new Error('Order has no shipping address.');
        }

        const phone = this.normalizedPhone(address.phoneNumber);
        if (!phone) {
            throw new Error('Order shipping phone number must be a valid Romanian phone number before generating AWB.');
        }

        const countryCode = address.countryCode ?? 'RO';
        const postalCode = this.requiredOrderString(address.postalCode, 'Order shipping postal code');
        const normalizedAddress = await this.normalizedRecipientAddress({
            countryCode,
            postalCode,
            city: address.city,
            county: this.countyFromOrderAddress(address),
            street: address.streetLine1,
        });

        const recipient: any = {
            contact: {
                name: this.requiredOrderString(
                    address.fullName || `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`.trim(),
                    'Order shipping contact name',
                ),
                phone,
                company: address.company,
                email: customer?.emailAddress,
            },
            address: {
                countryCode,
                postalCode,
                city: normalizedAddress.city,
                county: normalizedAddress.county,
                countyCode: normalizedAddress.countyCode,
                street: normalizedAddress.street,
                number: this.streetNumberFromOrderAddress(address),
                additionalInfo: address.streetLine2,
            },
            validationStrategy: validationStrategyOverride ?? process.env.COLETE_RECIPIENT_VALIDATION_STRATEGY ?? 'minimal',
        };

        if (customFields.coleteDeliveryType === 'locker' && customFields.coleteShippingPointId) {
            recipient.shippingPoint = {
                id: customFields.coleteShippingPointId,
            };
        }

        return recipient;
    }

    private serviceSelection(order?: Order) {
        const customFields = order?.customFields as OrderCustomFields | undefined;
        const activationId = customFields?.coleteCheckoutActivationId ?? process.env.COLETE_ONLINE_ACTIVATION_ID;
        const serviceIds = customFields?.coleteCheckoutServiceId
            ? [customFields.coleteCheckoutServiceId]
            : this.addressServiceIds(this.serviceIds());

        if (activationId) {
            if (customFields?.coleteDeliveryType === 'locker') {
                return {
                    activationId,
                    specific: {
                        domesticToPoint: {
                            override: true,
                            enabled: true,
                            selectionType: 'showClosest',
                            serviceIds: customFields.coleteCheckoutServiceId
                                ? [customFields.coleteCheckoutServiceId]
                                : this.lockerServiceIds(),
                        },
                    },
                };
            }

            return {
                activationId,
                serviceIds,
            };
        }

        return {
            selectionType: process.env.COLETE_ONLINE_SELECTION_TYPE ?? 'bestPrice',
            serviceIds,
        };
    }

    private serviceIds(): number[] {
        return this.parseServiceIds(process.env.COLETE_ONLINE_SERVICE_IDS, 'COLETE_ONLINE_SERVICE_IDS');
    }

    private addressServiceIds(fallback: number[] = []): number[] {
        const configured = process.env.COLETE_ONLINE_ADDRESS_SERVICE_IDS;
        if (configured == null) {
            return fallback;
        }

        return this.parseServiceIds(configured, 'COLETE_ONLINE_ADDRESS_SERVICE_IDS');
    }

    private parseServiceIds(value: string | undefined, envName: string): number[] {
        value = value ?? '';
        if (!value.trim()) {
            return [];
        }

        const ids = value
            .split(',')
            .map(id => Number(id.trim()))
            .filter(id => Number.isFinite(id));

        if (!ids.length) {
            throw new Error(`${envName} must contain numeric service ids or be left empty.`);
        }

        return ids;
    }

    private addressServiceSearch() {
        const serviceIds = this.addressServiceIds();
        const service: any = {
            selectionType: process.env.COLETE_ONLINE_SELECTION_TYPE ?? 'bestPrice',
        };

        if (serviceIds.length) {
            service.serviceIds = serviceIds;
        }

        return service;
    }

    private lockerServiceSearch() {
        return {
            specific: {
                domesticToPoint: {
                    override: true,
                    enabled: true,
                    selectionType: process.env.COLETE_ONLINE_LOCKER_SELECTION_TYPE ?? 'showClosest',
                    serviceIds: this.lockerServiceIds(),
                },
            },
        };
    }

    private lockerServiceIds(): number[] {
        const configured = process.env.COLETE_ONLINE_LOCKER_SERVICE_IDS;
        if (!configured?.trim()) {
            return [203, 205];
        }

        return configured
            .split(',')
            .map(id => Number(id.trim()))
            .filter(id => Number.isFinite(id));
    }

    private checkoutPackages() {
        return {
            type: 2,
            content: process.env.COLETE_CHECKOUT_PACKAGE_CONTENT ?? 'Sport equipment',
            list: [
                {
                    weight: this.numberEnv('COLETE_CHECKOUT_PACKAGE_WEIGHT_KG', 1),
                    width: this.numberEnv('COLETE_CHECKOUT_PACKAGE_WIDTH_CM', 20),
                    height: this.numberEnv('COLETE_CHECKOUT_PACKAGE_HEIGHT_CM', 10),
                    length: this.numberEnv('COLETE_CHECKOUT_PACKAGE_LENGTH_CM', 30),
                },
            ],
        };
    }

    private priceItemToQuote(deliveryType: 'address' | 'locker', item: any) {
        const service = item.service ?? {};
        const price = item.price ?? {};
        const shippingPoint = service.shippingPoint;

        return {
            deliveryType,
            priceWithTax: price.total ?? price.displayPrice,
            priceWithoutTax: price.noVat ?? null,
            courierName: service.courierName ?? null,
            serviceName: service.displayName ?? service.name ?? null,
            serviceId: service.id ?? null,
            activationId: service.activationId ?? null,
            shippingPointId: shippingPoint?.id ?? null,
            shippingPointName: shippingPoint?.name ?? null,
            shippingPointType: shippingPoint?.type ?? null,
            shippingPointAddress: shippingPoint?.address?.fullText ?? shippingPoint?.address?.fulltext ?? null,
            shippingPointLat: shippingPoint?.address?.coordinate?.lat ?? null,
            shippingPointLng: shippingPoint?.address?.coordinate?.lng ?? null,
            distanceKm: shippingPoint?.extendedData?.approximateDistance ?? null,
        };
    }

    private addressPriceItem(result: any) {
        const items = [result.selected, ...(result.list ?? [])].filter(Boolean);

        return items.find((item: any) => {
            const service = item.service ?? {};
            return item.price?.total && service.id && !this.isPointDeliveryService(service);
        });
    }

    private isPointDeliveryService(service: any) {
        if (service.shippingPoint) {
            return true;
        }

        const label = `${service.displayName ?? ''} ${service.name ?? ''}`.toLowerCase();
        return ['locker', '2locker', 'pickup', 'pick-up', 'point', 'easybox', 'pachetomat'].some(term =>
            label.includes(term),
        );
    }

    private logAddressPriceResult(order: Order, serviceSelection: any, result: any, selected: any) {
        const services = [result?.selected, ...(result?.list ?? [])]
            .filter(Boolean)
            .map((item: any, index: number) => {
                const service = item.service ?? {};
                return {
                    index,
                    id: service.id ?? null,
                    courierName: service.courierName ?? null,
                    name: service.name ?? null,
                    displayName: service.displayName ?? null,
                    activationId: service.activationId ? '[present]' : null,
                    priceTotal: item.price?.total ?? null,
                    priceNoVat: item.price?.noVat ?? null,
                    hasShippingPoint: !!service.shippingPoint,
                    rejectedAsPointDelivery: this.isPointDeliveryService(service),
                };
            });

        const selectedService = selected?.service;
        Logger.info(
            `[Colete][AddressPrice] ${JSON.stringify({
                orderCode: order.code,
                env: process.env.COLETE_ONLINE_ENV ?? 'production',
                serviceSelection,
                selectedDirectService: selectedService
                    ? {
                          id: selectedService.id ?? null,
                          courierName: selectedService.courierName ?? null,
                          name: selectedService.name ?? null,
                          displayName: selectedService.displayName ?? null,
                          priceTotal: selected?.price?.total ?? null,
                      }
                    : null,
                returnedServiceCount: services.length,
                returnedServices: services,
            })}`,
            loggerCtx,
        );
    }

    private shippingPointToQuote(county: string, point: NonNullable<ColeteShippingPointsResponse['points']>[number]) {
        const serviceItem = point.services?.list
            ?.filter(item => item.price?.total && item.service?.activationId)
            .sort((a, b) => (a.price?.total ?? 9999) - (b.price?.total ?? 9999))[0];

        if (!serviceItem?.price?.total || !serviceItem.service?.activationId) {
            return null;
        }

        return {
            deliveryType: 'locker',
            priceWithTax: serviceItem.price.total,
            priceWithoutTax: serviceItem.price.noVat ?? null,
            courierName: serviceItem.service.courierName ?? null,
            serviceName: serviceItem.service.displayName ?? serviceItem.service.name ?? null,
            serviceId: serviceItem.service.id ?? null,
            activationId: serviceItem.service.activationId,
            shippingPointId: point.id ?? null,
            shippingPointName: point.name ?? null,
            shippingPointType: point.type ?? null,
            shippingPointAddress: point.address?.fullText ?? point.address?.fulltext ?? null,
            shippingPointLat: point.address?.coordinate?.lat ?? null,
            shippingPointLng: point.address?.coordinate?.lng ?? null,
            shippingPointCounty: county,
            distanceKm: null,
        };
    }

    private moneyToMinorUnits(value: number): number {
        return Math.round(Number(value) * 100);
    }

    private numberEnv(name: string, fallback: number): number {
        const value = process.env[name];
        if (!value) {
            return fallback;
        }

        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }

    private requiredNumber(value: number | null | undefined, label: string): number {
        if (value === null || value === undefined || Number.isNaN(Number(value)) || Number(value) <= 0) {
            throw new Error(`${label} must be completed before generating AWB.`);
        }
        return Number(value);
    }

    private async activeOrder(ctx: RequestContext): Promise<Order> {
        const order = await this.activeOrderService.getActiveOrder(ctx, undefined);
        if (!order) {
            throw new Error('No active order found for this checkout session.');
        }

        const hydratedOrder = await this.orderService.findOne(ctx, order.id, ['customer']);
        if (!hydratedOrder) {
            throw new Error('Active order could not be loaded.');
        }

        return hydratedOrder;
    }

    private requiredEnv(name: string): string {
        const value = process.env[name];
        if (!value) {
            throw new Error(`Missing required environment variable ${name}.`);
        }
        return value;
    }

    private requiredOrderString(value: string | undefined, label: string): string {
        const trimmed = value?.trim();
        if (!trimmed) {
            throw new Error(`${label} must be completed before generating AWB.`);
        }
        return trimmed;
    }

    private countyFromOrderAddress(address: Order['shippingAddress']): string {
        const province = address?.province?.trim();
        if (province) {
            return province;
        }

        const city = address?.city?.trim().toLowerCase();
        if (city === 'bucuresti' || city === 'bucurești' || city === 'bucharest') {
            return 'Bucuresti';
        }

        return address?.city?.trim() || 'Bucuresti';
    }

    private streetNumberFromOrderAddress(address: Order['shippingAddress']): string {
        const secondaryLine = address?.streetLine2?.trim();
        if (secondaryLine && /^\d+[a-zA-Z]?$/.test(secondaryLine)) {
            return secondaryLine;
        }

        const streetNumber = address?.streetLine1?.match(/\b\d+[a-zA-Z]?\b/)?.[0];
        return streetNumber ?? '1';
    }

    private async normalizedRecipientAddress(input: {
        countryCode: string;
        postalCode: string;
        city: string | undefined;
        county: string;
        street: string | undefined;
    }): Promise<{
        city: string;
        county: string;
        countyCode?: string;
        street: string;
    }> {
        const city = this.requiredOrderString(input.city, 'Order shipping city');
        const street = this.requiredOrderString(input.street, 'Order shipping street');

        try {
            const reverse = await this.coleteClient.getPostalCodeReverse(input.countryCode, input.postalCode);
            const locality = reverse.locality;

            if (typeof locality === 'object' && locality?.city && locality?.county) {
                return {
                    city: locality.city.trim(),
                    county: locality.county.trim(),
                    countyCode: reverse.countyCode,
                    street: this.bestMatchingStreet(street, reverse.street) ?? street,
                };
            }
        } catch {
            // If the helper lookup fails, fall back to the order data and let /order
            // return the authoritative validation error.
        }

        return {
            city,
            county: input.county,
            street,
        };
    }

    private bestMatchingStreet(orderStreet: string, coleteStreets: string[] | undefined): string | undefined {
        if (!coleteStreets?.length) {
            return undefined;
        }

        const normalizedOrderStreet = this.normalizeAddressText(orderStreet);
        const scored = coleteStreets
            .map(street => ({
                street,
                score: this.normalizeAddressText(street)
                    .split(' ')
                    .filter(token => token.length > 2 && normalizedOrderStreet.includes(token)).length,
            }))
            .sort((a, b) => b.score - a.score);

        return scored[0]?.score ? scored[0].street : coleteStreets[0];
    }

    private normalizeAddressText(value: string): string {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    private normalizedPhone(phone: string | undefined): string | undefined {
        if (!phone) {
            return undefined;
        }

        const digits = phone.replace(/\D/g, '');
        if (digits.startsWith('0040') && digits.length === 13) {
            return `0${digits.slice(4)}`;
        }
        if (digits.startsWith('40') && digits.length === 11) {
            return `0${digits.slice(2)}`;
        }
        if (digits.length === 10 && digits.startsWith('0')) {
            return digits;
        }

        return undefined;
    }
}
