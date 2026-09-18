import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSyndicatMixteToTypeOrga1789568250084 implements MigrationInterface {
  name = "AddSyndicatMixteToTypeOrga1789568250084";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."partenaires_de_la_charte_organisme_type_enum" RENAME TO "partenaires_de_la_charte_organisme_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."partenaires_de_la_charte_organisme_type_enum" AS ENUM('epci', 'departement', 'region', 'syndicat-mixte', 'autre')`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" ALTER COLUMN "organisme_type" TYPE "public"."partenaires_de_la_charte_organisme_type_enum" USING "organisme_type"::"text"::"public"."partenaires_de_la_charte_organisme_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."partenaires_de_la_charte_organisme_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."partenaires_de_la_charte_organisme_type_enum_old" AS ENUM('epci', 'departement', 'region', 'autre')`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" ALTER COLUMN "organisme_type" TYPE "public"."partenaires_de_la_charte_organisme_type_enum_old" USING "organisme_type"::"text"::"public"."partenaires_de_la_charte_organisme_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."partenaires_de_la_charte_organisme_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."partenaires_de_la_charte_organisme_type_enum_old" RENAME TO "partenaires_de_la_charte_organisme_type_enum"`,
    );
  }
}
