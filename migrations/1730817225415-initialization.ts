import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialization1730817225415 implements MigrationInterface {
    name = 'Initialization1730817225415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "date" TIMESTAMP`);
    }

}
