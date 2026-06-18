import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventRegistration1772000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "event_registration" (
                                                  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                                                  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                                                  "eventName" character varying NOT NULL,
                                                  "source" character varying NOT NULL DEFAULT 'qr',
                                                  "fullName" character varying NOT NULL,
                                                  "fullNameNormalized" character varying NOT NULL,
                                                  "sportsClub" character varying,
                                                  "phoneNumber" character varying NOT NULL,
                                                  "phoneNormalized" character varying NOT NULL,
                                                  "email" character varying NOT NULL,
                                                  "emailNormalized" character varying NOT NULL,
                                                  "gdprConsent" boolean NOT NULL DEFAULT false,
                                                  "gdprConsentText" text NOT NULL,
                                                  "id" SERIAL NOT NULL,
                                                  CONSTRAINT "PK_10aedff1bd0d0ef534d1106ddec" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_42271627cf464b99567c576026"
                ON "event_registration" ("fullNameNormalized")
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_f0672d04ee61faeab40287f530"
                ON "event_registration" ("phoneNormalized")
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_15c65efd956a7cbae96c55b112"
                ON "event_registration" ("emailNormalized")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_15c65efd956a7cbae96c55b112"`);
        await queryRunner.query(`DROP INDEX "IDX_f0672d04ee61faeab40287f530"`);
        await queryRunner.query(`DROP INDEX "IDX_42271627cf464b99567c576026"`);
        await queryRunner.query(`DROP TABLE "event_registration"`);
    }
}