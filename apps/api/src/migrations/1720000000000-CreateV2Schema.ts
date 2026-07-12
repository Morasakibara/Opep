import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex, TableForeignKey } from 'typeorm';

export class CreateV2Schema1720000000000 implements MigrationInterface {
  name = 'CreateV2Schema1720000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add companyId/centreId columns to existing users table
    await queryRunner.addColumn('users', new TableColumn({
      name: 'companyId',
      type: 'uuid',
      isNullable: true,
    }));

    await queryRunner.addColumn('users', new TableColumn({
      name: 'centreId',
      type: 'uuid',
      isNullable: true,
    }));

    // 2. Add centreId columns to existing operational entities
    const operationalTables = ['trips', 'routes', 'buses', 'reservations', 'reviews'];
    for (const table of operationalTables) {
      await queryRunner.addColumn(table, new TableColumn({
        name: 'centreId',
        type: 'uuid',
        isNullable: true,
      }));

      await queryRunner.createIndex(table, new TableIndex({
        name: `IDX_${table.toUpperCase()}_CENTRE`,
        columnNames: ['centreId'],
      }));
    }

    // 3. companies table (must exist before subscriptions FK)
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar', isUnique: true },
          { name: 'directorUserId', type: 'uuid', isNullable: true },
          { name: 'address', type: 'varchar' },
          { name: 'city', type: 'varchar' },
          { name: 'phone', type: 'varchar' },
          { name: 'email', type: 'varchar' },
          { name: 'logoUrl', type: 'varchar', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'publicRatingAverage', type: 'decimal', precision: 2, scale: 1, isNullable: true },
          { name: 'reviewsCount', type: 'integer', default: 0 },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey('companies', new TableForeignKey({
      name: 'FK_companies_director',
      columnNames: ['directorUserId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));

    // 4. subscriptions table (with companyId FK to companies)
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'companyId', type: 'uuid', isNullable: true },
          { name: 'planName', type: 'varchar' },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'status', type: 'varchar', default: "'ACTIVE'" },
          { name: 'startDate', type: 'timestamp' },
          { name: 'endDate', type: 'timestamp' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey('subscriptions', new TableForeignKey({
      name: 'FK_subscriptions_company',
      columnNames: ['companyId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'companies',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createIndex('subscriptions', new TableIndex({
      name: 'IDX_SUBSCRIPTIONS_COMPANY',
      columnNames: ['companyId'],
    }));

    // 5. centres table
    await queryRunner.createTable(
      new Table({
        name: 'centres',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'companyId', type: 'uuid' },
          { name: 'managerUserId', type: 'uuid', isNullable: true },
          { name: 'name', type: 'varchar' },
          { name: 'city', type: 'varchar' },
          { name: 'address', type: 'varchar' },
          { name: 'phone', type: 'varchar' },
          { name: 'email', type: 'varchar' },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'cancellationPenaltyPercent', type: 'decimal', precision: 5, scale: 2, isNullable: true },
          { name: 'maxFreeReports', type: 'integer', isNullable: true },
          { name: 'minDepositPercent', type: 'integer', isNullable: true },
          { name: 'publicRatingAverage', type: 'decimal', precision: 2, scale: 1, isNullable: true },
          { name: 'reviewsCount', type: 'integer', default: 0 },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey('centres', new TableForeignKey({
      name: 'FK_centres_company',
      columnNames: ['companyId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'companies',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('centres', new TableForeignKey({
      name: 'FK_centres_manager',
      columnNames: ['managerUserId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createIndex('centres', new TableIndex({
      name: 'IDX_CENTRES_COMPANY',
      columnNames: ['companyId'],
    }));

    await queryRunner.createIndex('centres', new TableIndex({
      name: 'IDX_CENTRES_RATING',
      columnNames: ['publicRatingAverage', 'reviewsCount'],
    }));

    // 6. complaints table
    await queryRunner.createTable(
      new Table({
        name: 'complaints',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'tripId', type: 'uuid', isNullable: true },
          { name: 'reservationId', type: 'uuid', isNullable: true },
          { name: 'clientId', type: 'uuid' },
          { name: 'centreId', type: 'uuid' },
          { name: 'companyId', type: 'uuid' },
          { name: 'category', type: 'varchar' },
          { name: 'description', type: 'text' },
          { name: 'status', type: 'varchar', default: "'OPEN'" },
          { name: 'assignedToUserId', type: 'uuid', isNullable: true },
          { name: 'response', type: 'text', isNullable: true },
          { name: 'resolvedAt', type: 'timestamp', isNullable: true },
          { name: 'resolvedBy', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey('complaints', new TableForeignKey({
      name: 'FK_complaints_client',
      columnNames: ['clientId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('complaints', new TableIndex({
      name: 'IDX_COMPLAINTS_CENTRE',
      columnNames: ['centreId', 'status'],
    }));

    await queryRunner.createIndex('complaints', new TableIndex({
      name: 'IDX_COMPLAINTS_COMPANY',
      columnNames: ['companyId', 'status'],
    }));

    // 7. invoices table
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'companyId', type: 'uuid' },
          { name: 'subscriptionId', type: 'uuid' },
          { name: 'periodStart', type: 'timestamp' },
          { name: 'periodEnd', type: 'timestamp' },
          { name: 'amount', type: 'decimal', precision: 10, scale: 2 },
          { name: 'currency', type: 'varchar', default: "'XAF'" },
          { name: 'status', type: 'varchar', default: "'UNPAID'" },
          { name: 'issuedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'paidAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('invoices', new TableIndex({
      name: 'IDX_INVOICES_COMPANY',
      columnNames: ['companyId', 'status'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('invoices', 'IDX_INVOICES_COMPANY');
    await queryRunner.dropTable('invoices');
    await queryRunner.dropIndex('complaints', 'IDX_COMPLAINTS_COMPANY');
    await queryRunner.dropIndex('complaints', 'IDX_COMPLAINTS_CENTRE');
    await queryRunner.dropForeignKey('complaints', 'FK_complaints_client');
    await queryRunner.dropTable('complaints');
    await queryRunner.dropIndex('centres', 'IDX_CENTRES_RATING');
    await queryRunner.dropIndex('centres', 'IDX_CENTRES_COMPANY');
    await queryRunner.dropForeignKey('centres', 'FK_centres_manager');
    await queryRunner.dropForeignKey('centres', 'FK_centres_company');
    await queryRunner.dropTable('centres');
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_COMPANY');
    await queryRunner.dropForeignKey('subscriptions', 'FK_subscriptions_company');
    await queryRunner.dropTable('subscriptions');
    await queryRunner.dropForeignKey('companies', 'FK_companies_director');
    await queryRunner.dropTable('companies');

    // Reverse operational entity centreId columns
    const operationalTables = ['reviews', 'reservations', 'buses', 'routes', 'trips'];
    for (const table of operationalTables) {
      await queryRunner.dropIndex(table, `IDX_${table.toUpperCase()}_CENTRE`);
      await queryRunner.dropColumn(table, 'centreId');
    }

    await queryRunner.dropColumn('users', 'companyId');
    await queryRunner.dropColumn('users', 'centreId');
  }
}
