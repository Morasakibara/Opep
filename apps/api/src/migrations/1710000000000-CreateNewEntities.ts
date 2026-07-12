import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from 'typeorm';

export class CreateNewEntities1710000000000 implements MigrationInterface {
  name = 'CreateNewEntities1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. reviews table
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'tripId', type: 'uuid', isNullable: false },
          { name: 'clientId', type: 'uuid', isNullable: false },
          { name: 'agencyId', type: 'uuid', isNullable: false },
          { name: 'driverRating', type: 'int', isNullable: false },
          { name: 'comfortRating', type: 'int', isNullable: false },
          { name: 'comment', type: 'text', isNullable: true },
          { name: 'isPublic', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          {
            columnNames: ['tripId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'trips',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['clientId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['agencyId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'agencies',
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            columnNames: ['tripId', 'clientId'],
          },
        ],
      }),
      true,
    );

    // 2. gps_pings table
    await queryRunner.createTable(
      new Table({
        name: 'gps_pings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'tripId', type: 'uuid', isNullable: false },
          { name: 'latitude', type: 'float', isNullable: false },
          { name: 'longitude', type: 'float', isNullable: false },
          { name: 'speed', type: 'float', isNullable: true },
          { name: 'heading', type: 'float', isNullable: true },
          { name: 'recordedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          {
            columnNames: ['tripId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'trips',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('gps_pings', new TableIndex({
      name: 'IDX_GPS_PINGS_TRIP_RECORDED',
      columnNames: ['tripId', 'recordedAt'],
    }));

    // 3. notifications table
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'userId', type: 'uuid', isNullable: false },
          { name: 'reservationId', type: 'uuid', isNullable: true },
          { name: 'tripId', type: 'uuid', isNullable: true },
          { name: 'type', type: 'enum', enum: ['DEPARTURE_1H', 'DEPARTURE_30MIN', 'DEPARTURE_15MIN', 'DEPARTURE_5MIN', 'TRIP_MODIFIED', 'BUS_CHANGED', 'DRIVER_CHANGED'], isNullable: false },
          { name: 'channel', type: 'enum', enum: ['PUSH', 'SMS', 'WHATSAPP', 'EMAIL'], default: "'PUSH'" },
          { name: 'title', type: 'text', isNullable: false },
          { name: 'message', type: 'text', isNullable: false },
          { name: 'status', type: 'enum', enum: ['PENDING', 'SENT', 'FAILED', 'CANCELLED'], default: "'PENDING'" },
          { name: 'scheduledAt', type: 'timestamp', isNullable: false },
          { name: 'sentAt', type: 'timestamp', isNullable: true },
          { name: 'errorMessage', type: 'text', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('notifications', new TableIndex({
      name: 'IDX_NOTIFICATIONS_USER_STATUS',
      columnNames: ['userId', 'status'],
    }));

    await queryRunner.createIndex('notifications', new TableIndex({
      name: 'IDX_NOTIFICATIONS_SCHEDULED',
      columnNames: ['scheduledAt'],
    }));

    // 4. sessions table
    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'userId', type: 'uuid', isNullable: false },
          { name: 'token', type: 'varchar', isNullable: false },
          { name: 'ipAddress', type: 'varchar', isNullable: true },
          { name: 'userAgent', type: 'varchar', isNullable: true },
          { name: 'isRevoked', type: 'boolean', default: false },
          { name: 'expiresAt', type: 'timestamp', isNullable: false },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('sessions', new TableIndex({
      name: 'IDX_SESSIONS_TOKEN',
      columnNames: ['token'],
    }));

    await queryRunner.createIndex('sessions', new TableIndex({
      name: 'IDX_SESSIONS_USER',
      columnNames: ['userId'],
    }));

    // 5. Add deposit fields to reservations table
    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'depositPercentage',
      type: 'integer',
      default: 30,
    }));

    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'depositAmount',
      type: 'integer',
      isNullable: true,
    }));

    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'remainingAmount',
      type: 'integer',
      isNullable: true,
    }));

    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'depositPaidAt',
      type: 'timestamp',
      isNullable: true,
    }));

    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'balancePaidAt',
      type: 'timestamp',
      isNullable: true,
    }));

    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'balancePaidBy',
      type: 'varchar',
      isNullable: true,
    }));

    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'refundEligibleAmount',
      type: 'integer',
      isNullable: true,
    }));

    await queryRunner.addColumn('reservations', new TableColumn({
      name: 'refundPolicy',
      type: 'varchar',
      isNullable: true,
    }));

    // 6. Alter reservation status enum to add PENDING_BALANCE
    await queryRunner.query(`
      ALTER TYPE "public"."reservations_status_enum" 
      ADD VALUE IF NOT EXISTS 'PENDING_BALANCE'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.dropTable('sessions');
    await queryRunner.dropTable('notifications');
    await queryRunner.dropTable('gps_pings');
    await queryRunner.dropTable('reviews');

    // Remove deposit columns from reservations
    await queryRunner.dropColumn('reservations', 'refundPolicy');
    await queryRunner.dropColumn('reservations', 'refundEligibleAmount');
    await queryRunner.dropColumn('reservations', 'balancePaidBy');
    await queryRunner.dropColumn('reservations', 'balancePaidAt');
    await queryRunner.dropColumn('reservations', 'depositPaidAt');
    await queryRunner.dropColumn('reservations', 'remainingAmount');
    await queryRunner.dropColumn('reservations', 'depositAmount');
    await queryRunner.dropColumn('reservations', 'depositPercentage');

    // Note: PENDING_BALANCE removal from enum requires creating new type - simplified
  }
}
