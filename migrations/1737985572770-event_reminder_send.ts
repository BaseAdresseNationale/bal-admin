import { MigrationInterface, QueryRunner } from "typeorm";

export class EventReminderSend1737985572770 implements MigrationInterface {
    name = 'EventReminderSend1737985572770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "reminder_send" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "reminder_send"`);
    }

}
