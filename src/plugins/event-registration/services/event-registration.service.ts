import { Injectable } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';
import { EventRegistration } from '../entities/event-registration.entity';

type SubmitEventRegistrationInput = {
    eventName: string;
    fullName: string;
    sportsClub?: string | null;
    phoneNumber: string;
    email: string;
    gdprConsent: boolean;
};

@Injectable()
export class EventRegistrationService {
    constructor(private connection: TransactionalConnection) {}

    async submit(ctx: RequestContext, input: SubmitEventRegistrationInput) {
        const eventName = input.eventName.trim();
        const fullName = input.fullName.trim();
        const sportsClub = input.sportsClub?.trim() || null;
        const phoneNumber = input.phoneNumber.trim();
        const email = input.email.trim();

        if (!eventName || !fullName || !phoneNumber || !email) {
            return {
                __typename: 'EventRegistrationError',
                message: 'Please complete all required fields.',
                code: 'MISSING_REQUIRED_FIELDS',
            };
        }

        if (!input.gdprConsent) {
            return {
                __typename: 'EventRegistrationError',
                message: 'GDPR consent is required.',
                code: 'GDPR_CONSENT_REQUIRED',
            };
        }

        const fullNameNormalized = this.normalizeName(fullName);
        const phoneNormalized = this.normalizePhone(phoneNumber);
        const emailNormalized = this.normalizeEmail(email);

        if (!phoneNormalized || phoneNormalized.length < 8) {
            return {
                __typename: 'EventRegistrationError',
                message: 'Please enter a valid phone number.',
                code: 'INVALID_PHONE',
            };
        }

        if (!this.isValidEmail(emailNormalized)) {
            return {
                __typename: 'EventRegistrationError',
                message: 'Please enter a valid email address.',
                code: 'INVALID_EMAIL',
            };
        }

        const repository = this.connection.getRepository(ctx, EventRegistration);

        const existing = await repository
            .createQueryBuilder('registration')
            .where('registration.fullNameNormalized = :fullNameNormalized', {
                fullNameNormalized,
            })
            .orWhere('registration.phoneNormalized = :phoneNormalized', {
                phoneNormalized,
            })
            .orWhere('registration.emailNormalized = :emailNormalized', {
                emailNormalized,
            })
            .getOne();

        if (existing) {
            return {
                __typename: 'EventRegistrationError',
                message: 'A registration with these details already exists.',
                code: 'DUPLICATE_REGISTRATION',
            };
        }

        try {
            await repository.save(
                new EventRegistration({
                    eventName,
                    source: 'qr',
                    fullName,
                    fullNameNormalized,
                    sportsClub,
                    phoneNumber,
                    phoneNormalized,
                    email,
                    emailNormalized,
                    gdprConsent: true,
                    gdprConsentText:
                        'I agree that Beast Team MMA SRL may process my personal data for registration and communication related to the selected competition/event.',
                })
            );

            return {
                __typename: 'EventRegistrationSuccess',
                success: true,
            };
        } catch {
            return {
                __typename: 'EventRegistrationError',
                message: 'A registration with these details already exists.',
                code: 'DUPLICATE_REGISTRATION',
            };
        }
    }

    async exportCsv(ctx: RequestContext): Promise<string> {
        const repository = this.connection.getRepository(ctx, EventRegistration);

        const registrations = await repository.find({
            order: {
                createdAt: 'DESC',
            },
        });

        const headers = [
            'ID',
            'Event Name',
            'Source',
            'Full Name',
            'Sports Club',
            'Phone Number',
            'Email',
            'GDPR Consent',
            'GDPR Consent Text',
            'Submitted At',
        ];

        const rows = registrations.map((registration) => [
            registration.id,
            registration.eventName,
            registration.source,
            registration.fullName,
            registration.sportsClub || '',
            registration.phoneNumber,
            registration.email,
            registration.gdprConsent ? 'Yes' : 'No',
            registration.gdprConsentText,
            registration.createdAt.toISOString(),
        ]);

        return [
            headers.join(','),
            ...rows.map((row) => row.map((value) => this.escapeCsvValue(value)).join(',')),
        ].join('\r\n');
    }


    private escapeCsvValue(value: unknown): string {
        if (value === null || value === undefined) return '';

        const stringValue = String(value);

        if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n') ||
            stringValue.includes('\r')
        ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
    }

    private normalizeName(value: string) {
        return value
            .trim()
            .replace(/\s+/g, ' ')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    private normalizePhone(value: string) {
        return value.replace(/\D/g, '');
    }

    private normalizeEmail(value: string) {
        return value.trim().toLowerCase();
    }

    private isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
}