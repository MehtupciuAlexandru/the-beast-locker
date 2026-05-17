import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext, Transaction } from '@vendure/core';
import { EventRegistrationService } from '../services/event-registration.service';

type SubmitEventRegistrationInput = {
    eventName: string;
    fullName: string;
    sportsClub?: string | null;
    phoneNumber: string;
    email: string;
    gdprConsent: boolean;
};

@Resolver()
export class EventRegistrationResolver {
    constructor(private eventRegistrationService: EventRegistrationService) {}

    @Mutation()
    @Transaction()
    @Allow(Permission.Public)
    async submitEventRegistration(
        @Ctx() ctx: RequestContext,
        @Args('input') input: SubmitEventRegistrationInput
    ) {
        return this.eventRegistrationService.submit(ctx, input);
    }
}