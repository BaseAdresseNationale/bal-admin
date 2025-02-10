import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityParticipantToEvent1736951455423 implements MigrationInterface {
    name = 'EntityParticipantToEvent1736951455423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "participants" ("id" character varying(24) NOT NULL, "event_id" character varying(24) NOT NULL, "fullname" text NOT NULL, "community" text, "function" text, "email" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1cda06c31eec1c95b3365a0283f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_numeros_voie_id" ON "participants" ("event_id") `);
        await queryRunner.query(`ALTER TABLE "participants" ADD CONSTRAINT "FK_1f663d2c0e63c2b9794b6b12802" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participants" DROP CONSTRAINT "FK_1f663d2c0e63c2b9794b6b12802"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_numeros_voie_id"`);
        await queryRunner.query(`DROP TABLE "participants"`);
    }

}
