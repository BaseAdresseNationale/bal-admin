import { MigrationInterface, QueryRunner } from "typeorm";

export class Stats1768322482331 implements MigrationInterface {
  name = "Stats1768322482331";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stats" ("id" character varying(24) NOT NULL, "name" character varying NOT NULL, "value" json NOT NULL, CONSTRAINT "PK_c76e93dfef28ba9b6942f578ab1" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stats"`);
  }
}
