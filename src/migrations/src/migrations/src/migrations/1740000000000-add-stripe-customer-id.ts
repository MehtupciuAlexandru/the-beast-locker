import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStripeCustomerId1740000000000 implements MigrationInterface {
    name = "AddStripeCustomerId1740000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "customer"
            ADD COLUMN IF NOT EXISTS "customFieldsStripecustomerid" character varying(255)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "customer"
            DROP COLUMN IF EXISTS "customFieldsStripecustomerid"
        `);
    }
}