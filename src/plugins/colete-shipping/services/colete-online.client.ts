import { Injectable } from '@nestjs/common';

type ColeteToken = {
    accessToken: string;
    expiresAt: number;
};

type ColeteOrderResponse = {
    service?: {
        price?: {
            total?: number;
            noVat?: number;
            displayPrice?: number;
        };
        service?: {
            id?: number;
            courierName?: string;
            name?: string;
            displayName?: string;
        };
    };
    awb?: string;
    uniqueId?: string;
    estimatedPickupDate?: string;
    estimatedPickUpDate?: string;
};

type ColetePostalCodeReverseResponse = {
    locality?:
        | string
        | {
              city?: string;
              county?: string;
          };
    countyCode?: string;
    street?: string[];
};

export type ColetePriceResponse = {
    selected?: {
        price?: {
            total?: number;
            noVat?: number;
            displayPrice?: number;
        };
        service?: {
            id?: number;
            courierName?: string;
            name?: string;
            activationId?: string;
            displayName?: string;
            shippingPoint?: ColeteShippingPoint;
        };
    };
    list?: Array<{
        price?: {
            total?: number;
            noVat?: number;
            displayPrice?: number;
        };
        service?: {
            id?: number;
            courierName?: string;
            name?: string;
            activationId?: string;
            displayName?: string;
            shippingPoint?: ColeteShippingPoint;
        };
    }>;
};

type ColeteShippingPoint = {
    id?: number;
    operatorId?: number;
    type?: string;
    name?: string;
    address?: {
        coordinate?: {
            lat?: number;
            lng?: number;
        };
        fulltext?: string;
        fullText?: string;
    };
    extendedData?: {
        approximateDistance?: number;
    };
};

export type ColeteShippingPointsResponse = {
    points?: Array<{
        id?: number;
        operatorId?: number;
        type?: string;
        name?: string;
        address?: {
            coordinate?: {
                lat?: number;
                lng?: number;
            };
            fulltext?: string;
            fullText?: string;
        };
        services?: {
            general?: {
                startingPrice?: number;
                hasAvailableServices?: boolean;
            };
            list?: Array<{
                price?: {
                    total?: number;
                    noVat?: number;
                    displayPrice?: number;
                };
                service?: {
                    id?: number;
                    courierName?: string;
                    name?: string;
                    activationId?: string;
                    displayName?: string;
                };
            }>;
        };
    }>;
};

@Injectable()
export class ColeteOnlineClient {
    private token?: ColeteToken;

    async createOrder(payload: unknown): Promise<ColeteOrderResponse> {
        return this.request<ColeteOrderResponse>('order', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async getPrice(payload: unknown): Promise<ColetePriceResponse> {
        return this.request<ColetePriceResponse>('order/price', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async getPostalCodeReverse(countryCode: string, postalCode: string): Promise<ColetePostalCodeReverseResponse> {
        return this.request<ColetePostalCodeReverseResponse>(
            `search/postal-code-reverse/${encodeURIComponent(countryCode)}/${encodeURIComponent(postalCode)}?format=object`,
            {
                method: 'GET',
            },
        );
    }

    async getShippingPoints(county: string, payload: unknown): Promise<ColeteShippingPointsResponse> {
        return this.request<ColeteShippingPointsResponse>(
            `shipping-points/list/${encodeURIComponent(county)}`,
            {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        );
    }

    private async request<T>(path: string, init: RequestInit): Promise<T> {
        const token = await this.getToken();
        const response = await fetch(`${this.baseUrl()}${path}`, {
            ...init,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${token}`,
                ...(init.headers ?? {}),
            },
        });

        const text = await response.text();
        const data = text ? this.parseJson(text) : undefined;

        if (!response.ok) {
            const detail = typeof data === 'object' && data ? JSON.stringify(data) : text;
            throw new Error(`Colete Online returned ${response.status}: ${detail || response.statusText}`);
        }

        return data as T;
    }

    private async getToken(): Promise<string> {
        if (this.token && Date.now() < this.token.expiresAt - 60_000) {
            return this.token.accessToken;
        }

        const clientId = this.requiredEnv('COLETE_ONLINE_CLIENT_ID');
        const clientSecret = this.requiredEnv('COLETE_ONLINE_CLIENT_SECRET');
        const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const response = await fetch(process.env.COLETE_ONLINE_AUTH_URL ?? 'https://auth.colete-online.ro/token', {
            method: 'POST',
            headers: {
                authorization: `Basic ${basic}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({ grant_type: 'client_credentials' }),
        });

        const text = await response.text();
        const data = text ? this.parseJson(text) : undefined;

        if (!response.ok) {
            const detail = typeof data === 'object' && data ? JSON.stringify(data) : text;
            throw new Error(`Colete Online auth returned ${response.status}: ${detail || response.statusText}`);
        }

        const accessToken = (data as any)?.access_token;
        const expiresIn = Number((data as any)?.expires_in ?? 7200);
        if (!accessToken) {
            throw new Error('Colete Online auth did not return an access token.');
        }

        this.token = {
            accessToken,
            expiresAt: Date.now() + expiresIn * 1000,
        };

        return accessToken;
    }

    private baseUrl(): string {
        const configured = process.env.COLETE_ONLINE_BASE_URL;
        const baseUrl =
            configured ??
            (process.env.COLETE_ONLINE_ENV === 'production'
                ? 'https://api.colete-online.ro/v1/'
                : 'https://api.colete-online.ro/v1/staging/');

        return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    }

    private requiredEnv(name: string): string {
        const value = process.env[name];
        if (!value) {
            throw new Error(`Missing required environment variable ${name}.`);
        }
        return value;
    }

    private parseJson(text: string): unknown {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }
}
