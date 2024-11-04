import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialization1730741139771 implements MigrationInterface {
    name = 'Initialization1730741139771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."partenaire_de_la_charte_type_enum" AS ENUM('commune', 'organisme', 'entreprise')`);
        await queryRunner.query(`CREATE TYPE "public"."partenaire_de_la_charte_services_enum" AS ENUM('accompagnement technique', 'formation', 'formation technique', 'mise à disposition d''outils mutualisés', 'partage d''expérience', 'réalisation de bases adresses locales', 'sensibilisation')`);
        await queryRunner.query(`CREATE TABLE "partenaire_de_la_charte" ("id" character varying(24) NOT NULL, "name" text NOT NULL, "picture" text, "contact_last_name" text NOT NULL, "contact_first_name" text NOT NULL, "contact_email" text NOT NULL, "type" "public"."partenaire_de_la_charte_type_enum" NOT NULL DEFAULT 'commune', "charteURL" text, "link" text, "code_departement" text array, "services" "public"."partenaire_de_la_charte_services_enum" array NOT NULL, "datagouv_organization_id" text array, "api_depot_client_id" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "signature_date" TIMESTAMP, "code_region" text, "code_commune" text, "testimonyURL" text, "balURL" text, "orgnisme_type" text, "infos" text, "perimeter" text, "is_petimeter_france" boolean, CONSTRAINT "PK_48fb7a7d2e1593b593af7957363" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."events_type_enum" AS ENUM('formation', 'formation-lvl2', 'partenaire', 'adresselab', 'adresse-region', 'présentation')`);
        await queryRunner.query(`CREATE TYPE "public"."events_tags_enum" AS ENUM('Programme Base Adresse Locale', 'Base Adresse Locale', 'Commune', 'Base Adresse Nationale', 'Gouvernance', 'Adresse', 'Referentiel', 'Co construction', 'Adresse_Lab', 'Technique', 'Agile', 'Utilisateurs')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" character varying(24) NOT NULL, "title" text NOT NULL, "subtitle" text, "description" text NOT NULL, "type" "public"."events_type_enum" NOT NULL, "target" text NOT NULL, "date" TIMESTAMP, "tags" "public"."events_tags_enum" array NOT NULL, "is_online_only" boolean NOT NULL, "address" json, "href" text, "is_subscription_closed" boolean NOT NULL, "instructions" text, "startHour" text NOT NULL, "endHour" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bal-widget_type_enum" AS ENUM('published', 'draft')`);
        await queryRunner.query(`CREATE TABLE "bal-widget" ("id" character varying(24) NOT NULL, "type" "public"."bal-widget_type_enum" NOT NULL, "global" json, "communes" json, "gitbook" json, "contact_us" json, "gitbook_communes" json, "gitbook_particulier" json, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_249cf8769f2c00cbdf84c3fde0e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bal-widget"`);
        await queryRunner.query(`DROP TYPE "public"."bal-widget_type_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."events_tags_enum"`);
        await queryRunner.query(`DROP TYPE "public"."events_type_enum"`);
        await queryRunner.query(`DROP TABLE "partenaire_de_la_charte"`);
        await queryRunner.query(`DROP TYPE "public"."partenaire_de_la_charte_services_enum"`);
        await queryRunner.query(`DROP TYPE "public"."partenaire_de_la_charte_type_enum"`);
    }

}
