import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFcmTokenToUsers1783868542576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'fcmToken',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'fcmToken');
    }

}
