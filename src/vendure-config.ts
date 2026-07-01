import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
    LanguageCode,
} from '@vendure/core';


import {AssetServerPlugin, configureS3AssetStorage} from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import { StripePlugin } from "@vendure/payments-plugin/package/stripe";
import { RecaptchaProtectionPlugin } from './plugins/recaptcha-protection/recaptcha-protection.plugin';
import {beastOrderConfirmationHandler} from "./plugins/email-transport/beast-order-confirmation.handler";
import 'dotenv/config';
import path from 'path';
const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;
import { ProductCustomizationPlugin } from './plugins/product-customization/product-customization.plugin';
import {BeastLockerPlugin} from "./plugins/product-customization/beast-locker.plugin";
import {AuthValidationPlugin} from "./plugins/auth-validation/auth-validation-plugin";
import { EventRegistrationPlugin } from './plugins/event-registration/event-registration.plugin';
import { ColeteShippingPlugin } from './plugins/colete-shipping/colete-shipping.plugin';
import { coleteSelectedQuoteCalculator } from './plugins/colete-shipping/colete-selected-quote.calculator';
import {
    emailAddressChangeHandler,
    EmailPlugin,
    emailVerificationHandler, FileBasedTemplateLoader,
    passwordResetHandler
} from "@vendure/email-plugin";
import {ResendApiEmailSender} from "./plugins/email-transport/resend-api-email-sender";
import { defaultShippingCalculator } from '@vendure/core/dist/config/shipping-method/default-shipping-calculator';
const useS3 = process.env.APP_ENV !== 'dev';
console.log("APP_ENV:", process.env.APP_ENV);
console.log("S3_BUCKET:", process.env.S3_BUCKET);
const FRONTEND_URL = process.env.FRONTEND_URL;
const ADMIN_UI_URL = process.env.ADMIN_UI_URL;
const emailHandlers = [
    beastOrderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
    emailAddressChangeHandler,
];

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,

        cors: {
            origin: IS_DEV
                ? ['http://localhost:3001']
                : [
                    'https://the-beast-locker.vercel.app',
                    'https://beast-locker.ro',
                    'https://www.beast-locker.ro',
                ],
            credentials: true,
        },

        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        requireVerification: true,
        tokenMethod: 'cookie',
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
            sameSite: IS_DEV ? 'lax' : 'none',
            secure: !IS_DEV,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: true,
        migrations: [],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    shippingOptions: {
        shippingCalculators: [defaultShippingCalculator, coleteSelectedQuoteCalculator],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {

        Product: [
            {
                name: 'seoTitle',
                type: 'string',
                nullable: true,
                label: [{languageCode: LanguageCode.en, value: 'SEO Title'}],
            },

            {
                name: 'seoDescription',
                type: 'text',
                nullable: true,
                label: [{languageCode: LanguageCode.en, value: 'SEO Description'}],
            },

            {
                name: 'searchKeywords',
                type: 'text',
                nullable: true,
                label: [{languageCode: LanguageCode.en, value: 'Search Keywords'}],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Internal search terms and synonyms used to improve product search.',
                    },
                ],
            }
        ],
        Order: [
            {
                name: 'coletePackageWeightKg',
                type: 'float',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Package weight (kg)'}],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Final parcel weight confirmed by the warehouse worker before AWB generation.',
                    },
                ],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coletePackageLengthCm',
                type: 'float',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Package length (cm)'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coletePackageWidthCm',
                type: 'float',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Package width (cm)'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coletePackageHeightCm',
                type: 'float',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Package height (cm)'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coletePackageCount',
                type: 'int',
                nullable: true,
                public: false,
                defaultValue: 1,
                label: [{languageCode: LanguageCode.en, value: 'Package count'}],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Initial integration assumes one parcel per order; keep this editable for future multi-parcel support.',
                    },
                ],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coletePackageContent',
                type: 'string',
                nullable: true,
                public: false,
                defaultValue: 'Sport equipment',
                label: [{languageCode: LanguageCode.en, value: 'Package content'}],
                ui: { tab: 'Colete Online', fullWidth: true },
            },
            {
                name: 'coleteAwb',
                type: 'string',
                nullable: true,
                public: true,
                label: [{languageCode: LanguageCode.en, value: 'Colete AWB'}],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Future AWB/tracking number returned by Colete Online.',
                    },
                ],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteUniqueId',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Colete unique ID'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteCourierName',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Courier'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteServiceName',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Courier service'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteEstimatedPickupDate',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Estimated pickup date'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteAwbStatus',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'AWB status'}],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Placeholder status for the future AWB generation job.',
                    },
                ],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteAwbError',
                type: 'text',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'AWB error'}],
                ui: { tab: 'Colete Online', fullWidth: true },
            },
            {
                name: 'coleteDeliveryType',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Colete delivery type'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteCheckoutPriceWithTax',
                type: 'int',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Checkout shipping price with tax'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteCheckoutPriceWithoutTax',
                type: 'int',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Checkout shipping price without tax'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteCheckoutCourierName',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Checkout courier'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteCheckoutServiceName',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Checkout courier service'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteCheckoutServiceId',
                type: 'int',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Checkout service ID'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteCheckoutActivationId',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Checkout activation ID'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteShippingPointId',
                type: 'int',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker/shipping point ID'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteShippingPointName',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker/shipping point name'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteShippingPointType',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker/shipping point type'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteShippingPointAddress',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker/shipping point address'}],
                ui: { tab: 'Colete Online', fullWidth: true },
            },
            {
                name: 'coleteShippingPointLat',
                type: 'float',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker latitude'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteShippingPointLng',
                type: 'float',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker longitude'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteShippingPointCounty',
                type: 'string',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker county'}],
                ui: { tab: 'Colete Online' },
            },
            {
                name: 'coleteShippingPointDistanceKm',
                type: 'float',
                nullable: true,
                public: false,
                label: [{languageCode: LanguageCode.en, value: 'Locker distance (km)'}],
                ui: { tab: 'Colete Online' },
            },
        ],
    },

    plugins: [
        GraphiqlPlugin.init(),
        ProductCustomizationPlugin,
        BeastLockerPlugin,
        AuthValidationPlugin,
        EventRegistrationPlugin,
        ColeteShippingPlugin,
        StripePlugin.init({
            storeCustomersInStripe: true,
        }),
        RecaptchaProtectionPlugin,
        AssetServerPlugin.init(
            useS3
                ? {
                    route: 'assets',
                    assetUploadDir: path.join(__dirname, '../static/assets'),
                    storageStrategyFactory: configureS3AssetStorage({
                        bucket: process.env.S3_BUCKET!,
                        credentials: {
                            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                        },
                        nativeS3Configuration: {
                            endpoint: process.env.S3_ENDPOINT!,
                            region: process.env.S3_REGION!,
                            forcePathStyle: true,
                            signatureVersion: 'v4',
                        },
                    }),
                }
                : {
                    route: 'assets',
                    assetUploadDir: path.join(__dirname, '../static/assets'),
                }
        ),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init(
            IS_DEV
                ? {
                    devMode: true,
                    outputPath: path.join(__dirname, '../static/email/test-emails'),
                    route: 'mailbox',
                    handlers: emailHandlers,
                    templateLoader: new FileBasedTemplateLoader(
                        path.join(__dirname, '../static/email/templates')
                    ),
                    globalTemplateVars: {
                        fromAddress: '"example" <noreply@example.com>',
                        verifyEmailAddressUrl: `${FRONTEND_URL}/verify`,
                        passwordResetUrl: `${FRONTEND_URL}/password-reset`,
                        changeEmailAddressUrl: `${FRONTEND_URL}/verify-email-address-change`,
                    },
                }
                : {
                    transport: {
                        type: 'testing',
                        onSend: email => {
                            throw new Error(
                                `ResendApiEmailSender was bypassed for ${email.recipient}`,
                            );
                        },
                    },
                    emailSender: new ResendApiEmailSender(),

                    handlers: emailHandlers,
                    templateLoader: new FileBasedTemplateLoader(
                        path.join(__dirname, '../static/email/templates')
                    ),
                    globalTemplateVars: {
                        fromAddress: 'Beast Locker <noreply@beast-locker.ro>',
                        verifyEmailAddressUrl: `${FRONTEND_URL}/verify`,
                        passwordResetUrl: `${FRONTEND_URL}/password-reset`,
                        changeEmailAddressUrl: `${FRONTEND_URL}/verify-email-address-change`,
                    },
                }
        ),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
    ],
};
