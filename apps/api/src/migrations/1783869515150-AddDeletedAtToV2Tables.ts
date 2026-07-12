import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDeletedAtToV2Tables1783869515150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // All V2 entities extend BaseEntity which has @DeleteDateColumn()
        // Add deletedAt to all tables created by CreateV2Schema1720000000000
        const tables = ['companies', 'subscriptions', 'centres', 'complaints', 'invoices'];
        for (const table of tables) {
            await queryRunner.addColumn(table, new TableColumn({
                name: 'deletedAt',
                type: 'timestamp',
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tables = ['companies', 'subscriptions', 'centres', 'complaints', 'invoices'];
        for (const table of tables) {
            await queryRunner.dropColumn(table, 'deletedAt');
        }
    }

}
