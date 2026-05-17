import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { EventRegistration } from './entities/event-registration.entity';
import { eventRegistrationApiExtensions } from './api/event-registration-api-extensions';
import { EventRegistrationResolver } from './api/event-registration.resolver';
import { EventRegistrationService } from './services/event-registration.service';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [EventRegistration],
    providers: [EventRegistrationService],
    shopApiExtensions: {
        schema: eventRegistrationApiExtensions,
        resolvers: [EventRegistrationResolver],
    },
})
export class EventRegistrationPlugin {}