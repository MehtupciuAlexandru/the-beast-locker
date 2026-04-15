import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
    LanguageCode,
} from '@vendure/core';

import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import {AssetServerPlugin, configureS3AssetStorage} from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';
const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;
import { ProductCustomizationPlugin } from './plugins/product-customization/product-customization.plugin';
import {BeastLockerPlugin} from "./plugins/product-customization/beast-locker.plugin";
import {AuthValidationPlugin} from "./plugins/auth-validation/auth-validation-plugin";
import {ResendEmailSender} from "./plugins/email-transport/resend-email.plugin";
const useS3 = process.env.APP_ENV !== 'dev';
console.log("APP_ENV:", process.env.APP_ENV);
console.log("S3_BUCKET:", process.env.S3_BUCKET);
const FRONTEND_URL = process.env.FRONTEND_URL;
const ADMIN_UI_URL = process.env.ADMIN_UI_URL;

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
            ...(IS_DEV ? {} : { domain: '.beast-locker.ro' }),
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
            }
        ],
    },

    plugins: [
        GraphiqlPlugin.init(),
        ProductCustomizationPlugin,
        BeastLockerPlugin,
        AuthValidationPlugin,
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
                    handlers: defaultEmailHandlers,
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
                    transport: { type: 'none' },

                    emailSender: new ResendEmailSender(),

                    handlers: defaultEmailHandlers,
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
