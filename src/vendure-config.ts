import 'dotenv/config';
import path from 'path';

import {
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    LanguageCode,
    VendureConfig,
    dummyPaymentHandler,
} from '@vendure/core';

import {
    AssetServerPlugin,
    configureS3AssetStorage,
} from '@vendure/asset-server-plugin';

import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import { StripePlugin } from '@vendure/payments-plugin/package/stripe';
import {ResendApiEmailSender} from "./plugins/email-transport/resend-api-email-sender";
import {
    EmailPlugin,
    FileBasedTemplateLoader,
    emailAddressChangeHandler,
    emailVerificationHandler,
    passwordResetHandler,
} from '@vendure/email-plugin';

import { ProductCustomizationPlugin } from './plugins/product-customization/product-customization.plugin';
import { BeastLockerPlugin } from './plugins/product-customization/beast-locker.plugin';
import { AuthValidationPlugin } from './plugins/auth-validation/auth-validation-plugin';
import { RecaptchaProtectionPlugin } from './plugins/recaptcha-protection/recaptcha-protection.plugin';
import { EventRegistrationPlugin } from './plugins/event-registration/event-registration.plugin';
import { beastOrderConfirmationHandler } from './plugins/email-transport/beast-order-confirmation.handler';

process.on('unhandledRejection', reason => {
    console.error(
        `[process pid:${process.pid}] UNHANDLED REJECTION:`,
        reason,
    );
    process.exit(1);
});

process.on('uncaughtException', error => {
    console.error(
        `[process pid:${process.pid}] UNCAUGHT EXCEPTION:`,
        error,
    );
    process.exit(1);
});

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = Number(process.env.PORT) || 3000;
const useS3 = process.env.APP_ENV !== 'dev';

const FRONTEND_URL = process.env.FRONTEND_URL!;

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

        ...(IS_DEV
            ? {
                adminApiDebug: true,
                shopApiDebug: true,
            }
            : {}),
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
        synchronize: true,
        migrations: [],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },

    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },

    customFields: {
        Product: [
            {
                name: 'seoTitle',
                type: 'string',
                nullable: true,
                label: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'SEO Title',
                    },
                ],
            },
            {
                name: 'seoDescription',
                type: 'text',
                nullable: true,
                label: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'SEO Description',
                    },
                ],
            },
            {
                name: 'searchKeywords',
                type: 'text',
                nullable: true,
                label: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Search Keywords',
                    },
                ],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Internal search terms and synonyms used to improve product search.',
                    },
                ],
            },
        ],
    },

    plugins: [
        GraphiqlPlugin.init(),

        ProductCustomizationPlugin,
        BeastLockerPlugin,
        AuthValidationPlugin,
        EventRegistrationPlugin,

        StripePlugin.init({
            storeCustomersInStripe: true,
        }),

        RecaptchaProtectionPlugin,

        AssetServerPlugin.init(
            useS3
                ? {
                    route: 'assets',
                    assetUploadDir: path.join(
                        __dirname,
                        '../static/assets',
                    ),
                    storageStrategyFactory: configureS3AssetStorage({
                        bucket: process.env.S3_BUCKET!,
                        credentials: {
                            accessKeyId:
                                process.env.S3_ACCESS_KEY_ID!,
                            secretAccessKey:
                                process.env.S3_SECRET_ACCESS_KEY!,
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
                    assetUploadDir: path.join(
                        __dirname,
                        '../static/assets',
                    ),
                },
        ),

        DefaultSchedulerPlugin.init(),

        DefaultJobQueuePlugin.init({
            useDatabaseForBuffer: true,
        }),

        DefaultSearchPlugin.init({
            bufferUpdates: false,
            indexStockStatus: true,
        }),

        EmailPlugin.init(
            IS_DEV
                ? {
                    devMode: true,
                    outputPath: path.join(
                        __dirname,
                        '../static/email/test-emails',
                    ),
                    route: 'mailbox',
                    handlers: emailHandlers,
                    templateLoader: new FileBasedTemplateLoader(
                        path.join(
                            __dirname,
                            '../static/email/templates',
                        ),
                    ),
                    globalTemplateVars: {
                        fromAddress:
                            'Beast Locker <noreply@beast-locker.ro>',
                        verifyEmailAddressUrl:
                            `${FRONTEND_URL}/verify`,
                        passwordResetUrl:
                            `${FRONTEND_URL}/password-reset`,
                        changeEmailAddressUrl:
                            `${FRONTEND_URL}/verify-email-address-change`,
                    },
                }
                : {
                    transport: {
                        type: 'none',
                    },

                    emailSender: new ResendApiEmailSender(),

                    handlers: emailHandlers,

                    templateLoader: new FileBasedTemplateLoader(
                        path.join(
                            __dirname,
                            '../static/email/templates',
                        ),
                    ),

                    globalTemplateVars: {
                        fromAddress:
                            'Beast Locker <noreply@beast-locker.ro>',
                        verifyEmailAddressUrl:
                            `${FRONTEND_URL}/verify`,
                        passwordResetUrl:
                            `${FRONTEND_URL}/password-reset`,
                        changeEmailAddressUrl:
                            `${FRONTEND_URL}/verify-email-address-change`,
                    },
                },
        ),

        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
    ],
};