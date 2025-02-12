import { MigrationInterface, QueryRunner } from "typeorm";

export class PartenaireReview1738941552098 implements MigrationInterface {
  name = "PartenaireReview1738941552098";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" character varying(24) NOT NULL, "partenaire_id" character varying(24) NOT NULL, "fullname" text NOT NULL, "community" text, "email" text NOT NULL, "is_anonymous" bool, "rating" int NOT NULL, "comment" text, "is_published" bool,"created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1cda06c31eec1c95b3365a9134f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_partenaire_de_la_charte__id" ON "reviews" ("partenaire_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_1f663d2c0e63c2b9794b6b91421" FOREIGN KEY ("partenaire_id") REFERENCES "partenaires_de_la_charte"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_1f663d2c0e63c2b9794b6b91421"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_partenaire_de_la_charte__id"`
    );
    await queryRunner.query(`DROP TABLE "reviews"`);
  }
}
