import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { EventRegistration } from './entities/event-registration.entity';
import { eventRegistrationApiExtensions } from './api/event-registration-api-extensions';
import { EventRegistrationResolver } from './api/event-registration.resolver';
import { EventRegistrationService } from './services/event-registration.service';
import { eventRegistrationAdminApiExtensions } from './api/event-registration-admin-api-extensions';
import { EventRegistrationAdminResolver } from './api/event-registration-admin.resolver';
import { EventRegistrationExportController } from './api/event-registration-export.controller';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [EventRegistration],
    providers: [EventRegistrationService],
    controllers: [EventRegistrationExportController],
    shopApiExtensions: {
        schema: eventRegistrationApiExtensions,
        resolvers: [EventRegistrationResolver],
    },
    adminApiExtensions: {
        schema: eventRegistrationAdminApiExtensions,
        resolvers: [EventRegistrationAdminResolver],
    },
})
export class EventRegistrationPlugin {}