import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738000108350 implements MigrationInterface {
  name = 'Migration1738000108350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!queryRunner.query(`SELECT * FROM "payment"`)) {
      await queryRunner.query(
        `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "name" character varying(15) NOT NULL DEFAULT ' ', "age" character varying(4) NOT NULL DEFAULT '0000', "address" character varying(34) NOT NULL DEFAULT ' ', "cpf" character varying(11) NOT NULL DEFAULT '00000000000', "amountPaid" character varying(16) NOT NULL DEFAULT '0000000000000000', "birthDate" character varying(8) NOT NULL DEFAULT '00000000', CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment"`);
  }
}
