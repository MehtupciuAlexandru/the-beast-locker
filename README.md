# The Beast Locker

The Beast Locker is a headless e-commerce application: a Next.js storefront calls Vendure's GraphQL Shop API, administrators use the Vendure Dashboard, and a separate worker processes background jobs such as transactional emails.

This guide explains how to recreate the project using your own accounts and infrastructure. The previous owner's deployments and credentials are not required. A fresh installation can start with an empty database and asset bucket. Git recreates the application and its schema; catalog data and settings entered through a previous dashboard belong to the database and are not recreated from source.

## Stack

| Component | Technology | Purpose |
| --- | --- | --- |
| Storefront | Next.js 16.1.6, React 19.2.3, TypeScript | App Router pages, catalog, accounts, cart and checkout |
| Styling | Tailwind CSS 4, Lucide React | Styles and icons |
| Commerce backend | Vendure 3.5.3, Node.js, NestJS and TypeORM | Commerce logic, authentication, Shop/Admin GraphQL APIs |
| Administration | Vendure Dashboard and Vite | Store administration and dashboard extensions |
| Database | PostgreSQL; local image is PostgreSQL 16 | Commerce data, custom entities, default search and job queue |
| Payments | Vendure Stripe plugin, Payment Intents, React Stripe Elements | Card payment form and webhook settlement |
| Email | Vendure EmailPlugin and Resend SDK | Templates and production delivery through the Resend API |
| Assets | Vendure AssetServerPlugin and S3-compatible storage | Supabase Storage in the handoff architecture; local disk in development |
| Bot protection | Google reCAPTCHA v3 | Registration, login and selected checkout mutations |
| Shipping | Custom Colete Online integration | Quotes, address/locker delivery and AWB generation |
| Hosting | Railway backend and Vercel storefront | Separate deployments from the same repository |

Versions above come from the manifests; install using the committed lockfiles. The storefront has its own dependencies and Next.js version, separate from the root package. The Supabase SDK is installed, but the configured storage integration uses the S3 protocol, not Supabase Auth.

```text
Browser -> Next.js storefront -> Vendure Shop API -> PostgreSQL
                                     |-> Stripe / Colete Online
Admin -> Vendure Dashboard -> Admin API -> Asset storage
Vendure worker -> database job queue -> Resend
```

Redis, MySQL, MariaDB, Typesense and Elasticsearch in Docker Compose are generated optional scaffolding. The current application uses PostgreSQL and Vendure's default database-backed search/queue; those extra services are not required.

## What exists and is implemented

- Product listing/detail pages, account registration/login, verification, password recovery, cart, checkout, confirmation and informational pages.
- Cookie authentication with required email verification, custom registration validation and reCAPTCHA middleware.
- Product SEO title, SEO description and search keywords as custom fields; custom `featuredProducts` and `beastLockerInfo` queries.
- Stripe Payment Intent creation and a React payment form. Custom order-confirmation emails listen for settled payments with payment-method code `stripe-card`.
- File-based transactional email templates and a custom Resend API sender.
- Event registration, including Valhalla registration pages, a custom entity, Shop/Admin API extensions and CSV export.
- Colete quotes, locker selection, parcel/delivery order fields, a quote-based shipping calculator and dashboard AWB actions.
- Vendure's default scheduler, search and job queue.

`BeastLockerPlugin` is currently an empty extension placeholder. Implemented source flows still require service configuration and validation on your deployment. Neither package defines an automated test script; this README does not claim that all integrations have been tested on a fresh installation.

## Repository map

| Path | Contents |
| --- | --- |
| `src/vendure-config.ts` | Main API, database, auth, email, assets, custom fields and plugin configuration |
| `src/index.ts` | API startup and invocation of registered migrations |
| `src/index-worker.ts` | Worker and job queue startup |
| `src/plugins/` | Product, auth, reCAPTCHA, event, shipping and email extensions |
| `src/plugins/colete-shipping/dashboard/` | Custom shipping dashboard UI |
| `src/gql/` | Generated dashboard GraphQL types |
| `static/email/templates/` | Email templates required at runtime |
| `static/assets/` | Local uploads; ignored by Git |
| `frontend/app/` | Next.js routes and layouts |
| `frontend/components/`, `frontend/sections/`, `frontend/lib/` | UI, GraphQL requests and integration helpers |
| `vite.config.mts` | Dashboard build, outputting `dist/dashboard` |
| `docker-compose.yml`, `Dockerfile` | Local infrastructure and backend container recipe |
| `docs/` | Project plan, user stories, use cases, ERD and PlantUML diagrams |

## Accounts and resources to create

| Service | Your setup |
| --- | --- |
| GitHub | Repository access or your own copy, connected to deployment services |
| Railway | Backend API/worker services, PostgreSQL, environment variables and domain |
| Supabase or another S3 provider | Storage project/bucket, endpoint, region and S3 credentials |
| Resend | API key and verified sending domain |
| Google reCAPTCHA | v3 site registration, site/secret keys and allowed hostnames |
| Stripe | Account, test keys, webhook and Vendure payment-method configuration |
| Colete Online | API client credentials, appropriate environment, courier services and sender address |
| Vercel or another Next.js host | Storefront deployment rooted at `frontend/` |
| Domain/DNS provider | DNS access for storefront/backend domains and email verification |

Local catalog/dashboard development does not require Railway, Supabase or Resend. Use Docker PostgreSQL, local uploads and the development mailbox. Protected auth/checkout operations still require reCAPTCHA: the middleware has no development bypass. Full payment/shipping testing requires those service accounts.

## Local setup

### 1. Install dependencies and start PostgreSQL

### IMPORTANT: Remember to create your own .env file based on .env.example

Install Git, npm, Docker with Compose and Node.js compatible with the locked dependencies. The checked-in Dockerfile uses Node 20; for a new environment choose a supported release satisfying dependency engine requirements and verify both builds before deployment.

Clone the repository, then run from its root:

```sh
npm ci
docker compose up -d postgres_db
```

Root and frontend dependencies must be installed separately.

### 2. Create the backend environment

Create a private root `.env`, using `.env.example` as a reference. Copy commands are `Copy-Item .env.example .env` in PowerShell or `cp .env.example .env` on Unix shells.


Set `APP_ENV=dev` explicitly. Any other value, including unset, selects production asset/email behavior and secure cookies. Add Colete credentials when testing integrated shipping.

### 3. Create the frontend environment

Create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000/shop-api
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=replace-with-your-site-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=replace-with-your-stripe-test-publishable-key
```

Never put backend secrets in `NEXT_PUBLIC_*` variables; they are public browser configuration. Restart local servers after environment changes and rebuild production frontend deployments after public-variable changes.

There is no committed frontend template currently. To add `frontend/.env.example`, add `!.env.example` after `.env*` in `frontend/.gitignore`.

**API URL issue:** most requests expect the full `/shop-api` endpoint. Two requests in `frontend/lib/api/auth.ts` append `/shop-api` again. Normalize those callers to use the complete endpoint before testing all account flows. Removing the path from the environment variable would break other requests.

### 4. Start the applications

From the root:

```sh
npm run dev
```

This starts API, worker and Vite dashboard development servers. Alternatively run `npm run dev:server`, `npm run dev:worker` and `npm run dev:dashboard` in separate terminals. For a new database, starting the API first lets schema initialization finish before the worker starts.

In another terminal:

```sh
cd frontend
npm ci
npm run dev -- --port 3001
```

| Surface | Address |
| --- | --- |
| Storefront | `http://localhost:3001` |
| Shop API | `http://localhost:3000/shop-api` |
| Admin API | `http://localhost:3000/admin-api` |
| Development mailbox | `http://localhost:3000/mailbox` |
| Dashboard development | Vite URL printed in the terminal, with `/dashboard` |
| Built dashboard | `http://localhost:3000/dashboard` after building dashboard assets |

Development CORS expects port 3001. Initial admin credentials come from `SUPERADMIN_USERNAME` and `SUPERADMIN_PASSWORD` when initializing a fresh database.

## Environment reference

### Backend and frontend

| Backend variables | Purpose |
| --- | --- |
| `APP_ENV`, `PORT` | Runtime mode and API port |
| `COOKIE_SECRET` | Cookie signing secret |
| `SUPERADMIN_USERNAME`, `SUPERADMIN_PASSWORD` | Initial administrator |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_SCHEMA` | PostgreSQL connection |
| `FRONTEND_URL` | Storefront origin for email links; omit trailing slash |
| `RECAPTCHA_SECRET_KEY` | Backend token verification |
| `RESEND_API_KEY` | Production email delivery |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Production asset storage |

Frontend variables are the three `NEXT_PUBLIC_*` entries in the local example above. The repository also has a server-side reCAPTCHA helper under `frontend/lib/recaptcha/server.ts`, but no caller was found; the active middleware verifies tokens in Vendure.

Vendure reads individual `DB_*` fields, not `DATABASE_URL` or `DATABASE_PUBLIC_URL`. Railway expressions such as `${{Postgres.PGHOST}}` resolve in Railway, not automatically in a local `.env`. `PGDATA` and `POSTGRES_*` configure database infrastructure rather than Vendure directly.

`APP_URL`, `VENDURE_SHOP_API_URL`, `SSL_CERT_DAYS` and `S3_FORCE_PATH_STYLE` are not read by the inspected application code. S3 path-style access is hardcoded to true. `ADMIN_UI_URL` is read into an unused constant and currently has no effect.

### Colete Online settings

| Variables | Purpose/defaults |
| --- | --- |
| `COLETE_ONLINE_ENV` | Explicitly use `staging` during testing; code otherwise defaults toward production |
| `COLETE_ONLINE_CLIENT_ID`, `COLETE_ONLINE_CLIENT_SECRET` | API authentication |
| `COLETE_AWB_GENERATION_ENABLED` | `false` prevents shipment creation, but does not disable quote requests |
| `COLETE_SYNC_SHIPPING_METHODS` | `false` disables automatic calculator updates on startup |
| `COLETE_SHIPPING_METHOD_CODES` | Existing methods to update; default `standard-shipping,express-shipping` |
| `COLETE_ONLINE_SERVICE_IDS` | Comma-separated shipment service filter |
| `COLETE_ONLINE_ADDRESS_SERVICE_IDS`, `COLETE_ONLINE_LOCKER_SERVICE_IDS` | Address/locker service filters |
| `COLETE_ONLINE_SELECTION_TYPE`, `COLETE_ONLINE_LOCKER_SELECTION_TYPE` | Defaults `bestPrice`, `showClosest` |
| `COLETE_CHECKOUT_PACKAGE_WEIGHT_KG` | Estimated checkout weight; default 1 |
| `COLETE_CHECKOUT_PACKAGE_LENGTH_CM`, `COLETE_CHECKOUT_PACKAGE_WIDTH_CM`, `COLETE_CHECKOUT_PACKAGE_HEIGHT_CM` | Estimated dimensions; defaults 30, 20, 10 |
| `COLETE_CHECKOUT_PACKAGE_CONTENT` | Default `Sport equipment` |
| `COLETE_SENDER_ADDRESS_ID` | Optional saved sender address instead of explicit fields |
| `COLETE_SENDER_NAME`, `COLETE_SENDER_PHONE`, `COLETE_SENDER_EMAIL` | Sender contact |
| `COLETE_SENDER_COUNTRY_CODE`, `COLETE_SENDER_POSTAL_CODE`, `COLETE_SENDER_CITY`, `COLETE_SENDER_COUNTY`, `COLETE_SENDER_STREET`, `COLETE_SENDER_NUMBER` | Warehouse address; country defaults to `RO` |
| `COLETE_SENDER_COMPANY`, `COLETE_SENDER_BUILDING`, `COLETE_SENDER_ENTRANCE`, `COLETE_SENDER_FLOOR`, `COLETE_SENDER_APARTMENT`, `COLETE_SENDER_ADDITIONAL_INFO` | Optional sender details |
| `COLETE_SENDER_VALIDATION_STRATEGY`, `COLETE_RECIPIENT_VALIDATION_STRATEGY` | Address validation; recipient defaults to `minimal` |
| `COLETE_USE_DUMMY_SENDER` | Staging-only helper; code rejects dummy sender in production |
| `COLETE_ONLINE_AUTH_URL`, `COLETE_ONLINE_BASE_URL`, `COLETE_ONLINE_ACTIVATION_ID` | Optional advanced overrides |

Omit optional overrides to use built-in defaults. Empty strings can override defaults where code uses nullish coalescing. Confirm available courier/service IDs using your account; template examples do not establish availability. Startup sync updates matching shipping methods; it does not create them.

## Third-party setup

### Supabase Storage / S3

Create a bucket and generate server-side S3 access credentials. Copy the provider's endpoint, region and credential pair into the backend `S3_*` variables. Use S3 access credentials, not a frontend Supabase anonymous key. See [Supabase S3 authentication](https://supabase.com/docs/guides/storage/s3/authentication).

Asset storage and the Vendure PostgreSQL database are separate resources. Using Supabase for assets does not require using its database for commerce. Development uploads use `static/assets`; production uploads must persist through the configured bucket. Test upload and retrieval through Vendure after configuration.

### Resend

Create an API key and verify a domain you control using the required DNS records. Set `RESEND_API_KEY` and change the production `fromAddress` in `src/vendure-config.ts` from `Beast Locker <noreply@beast-locker.ro>` to an address under your verified domain. Set `FRONTEND_URL` to your storefront. See [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction).

Give the worker the relevant backend variables and keep it running for queued email delivery. Development uses the local mailbox instead of Resend. Preserve `static/email/templates` in the deployment image.

### Google reCAPTCHA v3

Register your hostnames, including localhost for local development as appropriate. Put the site key in the frontend and the matching secret in the backend. The middleware validates `login`, `register` and `checkout` actions and their score thresholds. See [Google's v3 guide](https://developers.google.com/recaptcha/docs/v3).

### Stripe

Start with test credentials. Create an enabled Vendure payment method with code **`stripe-card`**, select the Stripe handler and enter the secret API key and webhook signing secret in its dashboard settings. These secrets are stored in the Vendure database; this implementation does not read a backend `STRIPE_SECRET_KEY` variable.

Configure `https://YOUR_BACKEND/payments/stripe` as a webhook for `payment_intent.succeeded` and `payment_intent.payment_failed`. Set the frontend publishable key from the same account and test/live mode. For local testing:

```sh
stripe listen --forward-to localhost:3000/payments/stripe
```

Use the signing secret returned by the CLI for local testing. The webhook settles the order; reaching the confirmation page alone does not prove settlement. See [Vendure Stripe setup](https://docs.vendure.io/current/community-plugins/stripe-plugin). Current upstream docs show a newer community package; this repo uses `@vendure/payments-plugin` 3.5.x, so do not change imports without planning an upgrade.

### Colete Online

Create your own API client and configure staging credentials and sender details. Test quotes and locker selection before enabling AWB generation. Enter actual parcel dimensions in the dashboard before generating an AWB; checkout defaults are estimates. Production AWB creation can create a real shipping order.

Create Vendure shipping methods with appropriate eligibility, then select the custom quote calculator or enable startup sync for their codes. Confirm courier services and warehouse data before production. See `src/plugins/colete-shipping/` for exact request and validation behavior.

## Initialize an empty store

There is no store-population script in the package scripts. After schema initialization and dashboard login:

1. Review channel language/currency, countries/zones, taxes and stock locations.
2. Create products, variants, prices and inventory; upload images and organize collections/facets. Match collection slugs or identifiers expected by storefront links.
3. Configure shipping methods and Colete eligibility/calculator when using integrated delivery.
4. Create the `stripe-card` payment method and webhook configuration.
5. Create appropriate admin roles and verify customer registration and email delivery.
6. Complete a test order before accepting live payments.

These settings and records belong to the database. Recreating from Git preserves code-defined features but starts without previous catalog, orders, customers, event registrations or dashboard settings.

## Railway deployment

### Build preparation

Expected build sequence from the repository root:

```sh
npm ci --include=dev
npm run build
npm run build:dashboard
```

**Repair the Dockerfile before a fresh container deployment:** it currently runs `npm install --production` before compiling, omitting development tools such as TypeScript. Install development dependencies in the build stage, build API/dashboard, then retain the required runtime dependencies, `dist` and `static/email/templates` in the runtime image.

There is currently no `.dockerignore`. Add one before building from a local checkout to exclude private `.env` files, `.git`, local `node_modules` and `frontend/.next`. Keep source, lockfiles and templates required by the build. Git ignore rules do not control Docker's `COPY . .` behavior.

Railway detects a root Dockerfile; changing only a dashboard build command will not repair its installation step. See [Railway Dockerfile builds](https://docs.railway.com/builds/dockerfiles). If dashboard compilation needs configuration during image construction, provide only the build-time values needed and do not bake production secrets into the image.

### Provision and start

1. Create a Railway project and PostgreSQL resource.
2. Connect this repository, using the repository root for the backend service and the intended branch/commit.
3. Configure `APP_ENV=production`, all `DB_*` values, admin credentials, `COOKIE_SECRET`, `FRONTEND_URL`, reCAPTCHA, Resend, S3 and Colete settings. Railway database references can populate `DB_*`; `DATABASE_URL` alone is insufficient.
4. Start the API with `node dist/index.js`. Let initial schema creation complete before starting the worker against a new database.
5. Deploy a worker service from the same code/build using `node dist/index-worker.js`, sharing the database and relevant backend variables. It needs no public domain.
6. Give the API an HTTPS domain and route to its configured `PORT`. Check `/dashboard` and GraphQL endpoints.
7. Update Stripe's webhook and the storefront API URL, then perform the verification checklist below.

The existing root `npm start` launches both processes using Unix shell `&`. It is a single-container option, but does not robustly supervise both processes. Separate services make failure/restart behavior clearer. Do not run the combined script when intending an API-only service plus a separate worker.

The repository does not contain a complete Railway infrastructure definition. Provision resources, secrets and domains in your account. If a PostgreSQL provider requires TLS, configure driver SSL options for that provider; the current Vendure config has no explicit SSL settings.

## Storefront deployment

On Vercel, import the same repository with root directory **`frontend`**, use the Next.js preset and `npm run build`, and configure the three public variables before building. Set `NEXT_PUBLIC_API_URL=https://YOUR_BACKEND/shop-api`. See [Vercel monorepo projects](https://vercel.com/docs/monorepos).

For another Node host, build inside `frontend/` and run its `npm start`. Root build/start commands belong to Vendure.

Before using new domains:

- Update `apiOptions.cors.origin` in `src/vendure-config.ts`; it currently lists previous storefront domains. Setting `FRONTEND_URL` does not update this allowlist.
- Set `FRONTEND_URL` and reCAPTCHA hostnames to your storefront.
- Use HTTPS for production cookies and test cross-origin sessions. Browser third-party-cookie restrictions can affect unrelated storefront/backend domains.
- Review `frontend/next.config.ts`: it mixes CommonJS and default exports, and the image-host configuration mentions only localhost. Consolidate the export and configure the actual image host when using optimized remote images.
- Review hardcoded brand domains, contact information and legal/informational pages for the new operator.

## Migrations

The database config currently uses `synchronize: true` and `migrations: []`. Vendure/TypeORM creates or synchronizes tables on startup. This enables an empty development installation but does not restore any previous data.

Before maintaining valuable production records, back up the database, establish reviewed migrations using tooling matching the installed Vendure version, register them and set `synchronize: false`. The API entry point already calls `runMigrations(config)`, but no migrations are registered. Test schema changes on a disposable copy and use a controlled migration step instead of concurrent schema modifications by multiple services.

## Commands and verification

| Directory | Command | Purpose |
| --- | --- | --- |
| Root | `npm run dev` | API, worker and dashboard development |
| Root | `npm run dev:server`, `npm run dev:worker`, `npm run dev:dashboard` | Individual development processes |
| Root | `npm run build` | Backend compilation |
| Root | `npm run build:dashboard` | Dashboard compilation |
| Root | `node dist/index.js`, `node dist/index-worker.js` | Individual production processes |
| `frontend/` | `npm run dev -- --port 3001` | Local storefront |
| `frontend/` | `npm run lint` | ESLint |
| `frontend/` | `npm run build`, `npm start` | Production storefront build/start |

Check these on your own infrastructure:

- API and worker start without configuration/database errors; dashboard login works.
- A new product appears in the storefront and its uploaded image survives a backend redeploy.
- Registration, verification, login/logout and password reset work with correctly addressed emails.
- Cart, shipping address, quotes and locker selection work.
- Stripe test payment settles in Vendure through the webhook and sends an order email.
- Event registration and authorized CSV export work.
- AWB generation is deliberately tested in the appropriate environment with correct sender and parcel data.


This guide was written from source/configuration inspection. Writing it did not perform a fresh install, deploy services or validate live integrations. Successful builds and the checklist above are the confirmation for your environment.

## Handoff and credentials

Share code, lockfiles, sanitized environment examples and this guide. New developers create their own service accounts and keys. Private root `.env` and frontend `.env.local` do not travel with a clone if never committed. `.gitignore` does not untrack files or remove secrets from history.

Replace actual values in tracked examples with placeholders and revoke/rotate any previously exposed secrets. Review GitHub workflow secrets and hosting connections when transferring access. Sanitize Stripe settings and personal data if sharing a database in the future.

For this handoff, no previous deployed data is intended to be preserved. Once all required code is committed, old Railway/database/storage resources are not needed to recreate the implementation. Deleting them stops the old site and removes any unexported hosted data/assets. If preservation becomes necessary, export a sanitized database and download uploaded assets before deletion; Git includes neither automatically.
