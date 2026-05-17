import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class EventRegistration extends VendureEntity {
    constructor(input?: DeepPartial<EventRegistration>) {
        super(input);
    }

    @Column()
    eventName: string;

    @Column({ default: 'qr' })
    source: string;

    @Column()
    fullName: string;

    @Index({ unique: true })
    @Column()
    fullNameNormalized: string;

    @Column({ nullable: true })
    sportsClub: string;

    @Column()
    phoneNumber: string;

    @Index({ unique: true })
    @Column()
    phoneNormalized: string;

    @Column()
    email: string;

    @Index({ unique: true })
    @Column()
    emailNormalized: string;

    @Column({ default: false })
    gdprConsent: boolean;

    @Column('text')
    gdprConsentText: string;
}