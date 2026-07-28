import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateNewModuleTables1790000000000 implements MigrationInterface {
  name = 'CreateNewModuleTables1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. drivers table
    await queryRunner.createTable(
      new Table({
        name: 'drivers',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'licenseNumber', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'status', type: 'varchar', default: "'ACTIVE'" },
          { name: 'rating', type: 'float', default: 5.0 },
          { name: 'totalTrips', type: 'int', default: 0 },
          { name: 'performanceScore', type: 'int', isNullable: true },
          { name: 'userId', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    // 2. incidents table
    await queryRunner.createTable(
      new Table({
        name: 'incidents',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'type', type: 'varchar', isNullable: false },
          { name: 'description', type: 'text', isNullable: false },
          { name: 'status', type: 'varchar', default: "'PENDING'" },
          { name: 'refundTriggered', type: 'boolean', default: false },
          { name: 'refundAmount', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'reportedById', type: 'uuid', isNullable: true },
          { name: 'tripId', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['reportedById'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['tripId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'trips',
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    // 3. messages table
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'content', type: 'text', isNullable: false },
          { name: 'senderId', type: 'uuid', isNullable: true },
          { name: 'receiverId', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['senderId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['receiverId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    // 4. schedules table
    await queryRunner.createTable(
      new Table({
        name: 'schedules',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'routeId', type: 'uuid', isNullable: false },
          { name: 'departureTime', type: 'varchar', length: '5', isNullable: false },
          { name: 'company', type: 'varchar', length: '100', isNullable: false },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['routeId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'routes',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Indexes
    await queryRunner.createIndex('drivers', new TableIndex({
      name: 'IDX_DRIVERS_USER_ID',
      columnNames: ['userId'],
    }));

    await queryRunner.createIndex('incidents', new TableIndex({
      name: 'IDX_INCIDENTS_STATUS',
      columnNames: ['status'],
    }));

    await queryRunner.createIndex('messages', new TableIndex({
      name: 'IDX_MESSAGES_SENDER_RECEIVER',
      columnNames: ['senderId', 'receiverId'],
    }));

    await queryRunner.createIndex('schedules', new TableIndex({
      name: 'IDX_SCHEDULES_ROUTE_ACTIVE',
      columnNames: ['routeId', 'isActive'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedules');
    await queryRunner.dropTable('messages');
    await queryRunner.dropTable('incidents');
    await queryRunner.dropTable('drivers');
  }
}
