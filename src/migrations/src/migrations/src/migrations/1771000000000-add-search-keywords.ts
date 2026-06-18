import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchKeywords1771000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "product" ADD "customFieldsSearchkeywords" text`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "customFieldsSearchkeywords"`,
            undefined
        );
    }

}