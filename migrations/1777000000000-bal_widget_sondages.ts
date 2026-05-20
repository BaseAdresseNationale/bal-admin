import { MigrationInterface, QueryRunner } from "typeorm";

export class BalWidgetSondages1777000000000 implements MigrationInterface {
  name = "BalWidgetSondages1777000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bal_widget" ADD "sondages" json DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bal_widget" DROP COLUMN "sondages"`);
  }
}
