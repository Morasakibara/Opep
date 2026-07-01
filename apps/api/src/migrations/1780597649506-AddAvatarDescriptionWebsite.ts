import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarDescriptionWebsite1780597649506 implements MigrationInterface {
    name = 'AddAvatarDescriptionWebsite1780597649506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "agencies" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "agencies" ADD "website" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agencies" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "agencies" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
    }
}
