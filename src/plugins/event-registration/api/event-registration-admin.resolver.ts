import { Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';
import { EventRegistrationService } from '../services/event-registration.service';

@Resolver()
export class EventRegistrationAdminResolver {
    constructor(private eventRegistrationService: EventRegistrationService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    async exportEventRegistrationsCsv(
        @Ctx() ctx: RequestContext
    ): Promise<string> {
        return this.eventRegistrationService.exportCsv(ctx);
    }
}