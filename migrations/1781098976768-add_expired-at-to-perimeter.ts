import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiredAtToPerimeter1781098976768
  implements MigrationInterface
{
  name = "AddExpiredAtToPerimeter1781098976768";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "perimeters" ADD "expired_at" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "perimeters" DROP COLUMN "expired_at"`,
    );
  }
}
