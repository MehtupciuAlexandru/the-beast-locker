import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';
import { EventRegistrationService } from '../services/event-registration.service';

@Controller('event-registrations')
export class EventRegistrationExportController {
    constructor(private eventRegistrationService: EventRegistrationService) {}

    @Get('export.csv')
    @Allow(Permission.SuperAdmin)
    async exportCsv(
        @Ctx() ctx: RequestContext,
        @Res() res: Response
    ) {
        const csv = await this.eventRegistrationService.exportCsv(ctx);

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="event-registrations.csv"'
        );

        res.send('\uFEFF' + csv);
    }
}