import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSeoTitle1770993686400 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsSeotitle" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsSeotitle"`, undefined);
   }

}
