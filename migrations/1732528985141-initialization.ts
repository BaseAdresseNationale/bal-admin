import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialization1732528985141 implements MigrationInterface {
    name = 'Initialization1732528985141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "partenaires_de_la_charte" ("id" character varying(24) NOT NULL, "name" text NOT NULL, "picture" text, "contact_last_name" text NOT NULL, "contact_first_name" text NOT NULL, "contact_email" text NOT NULL, "type" "public"."partenaires_de_la_charte_type_enum" NOT NULL DEFAULT 'commune', "charte_url" text, "link" text, "code_departement" text array, "services" "public"."partenaires_de_la_charte_services_enum" array NOT NULL, "datagouv_organization_id" text array, "api_depot_client_id" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "signature_date" TIMESTAMP, "code_region" text, "code_commune" text, "testimony_url" text, "bal_url" text, "organisme_type" "public"."partenaires_de_la_charte_organisme_type_enum", "infos" text, "perimeter" text, "is_perimeter_france" boolean, CONSTRAINT "PK_92308cb15f5073224e91b6901c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" character varying(24) NOT NULL, "title" text NOT NULL, "subtitle" text, "description" text NOT NULL, "type" "public"."events_type_enum" NOT NULL, "target" text NOT NULL, "date" date, "tags" "public"."events_tags_enum" array NOT NULL, "is_online_only" boolean NOT NULL, "address" json, "href" text, "is_subscription_closed" boolean NOT NULL, "instructions" text, "start_hour" text NOT NULL, "end_hour" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bal_widget" ("id" character varying(24) NOT NULL, "global" json, "communes" json, "contact_us" json, "gitbook_communes" json, "gitbook_particulier" json, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a18b49618fe28cbde17bc4f25e5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bal_widget"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "partenaires_de_la_charte"`);
    }

}
