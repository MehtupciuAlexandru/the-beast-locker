import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSeoDescription1770994286517 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsSeodescription" text`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsSeodescription"`, undefined);
   }

}
