import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Creates the subscriptions table needed by SubscriptionGuard
 * used in DriversController, IncidentsController, and MessagesController.
 */
export class CreateSubscriptionsTable1795000000000 implements MigrationInterface {
  name = 'CreateSubscriptionsTable1795000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'planName', type: 'varchar', isNullable: false },
          { name: 'price', type: 'decimal', precision: 10, scale: 2, isNullable: false },
          { name: 'status', type: 'varchar', isNullable: false, default: "'ACTIVE'" },
          { name: 'startDate', type: 'timestamp', isNullable: false },
          { name: 'endDate', type: 'timestamp', isNullable: false },
          { name: 'companyId', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['companyId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('subscriptions', new TableIndex({
      name: 'IDX_SUBSCRIPTIONS_COMPANY_STATUS',
      columnNames: ['companyId', 'status'],
    }));

    await queryRunner.createIndex('subscriptions', new TableIndex({
      name: 'IDX_SUBSCRIPTIONS_END_DATE',
      columnNames: ['endDate'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscriptions');
  }
}
