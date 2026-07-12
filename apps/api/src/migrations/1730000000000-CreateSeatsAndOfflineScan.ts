import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateSeatsAndOfflineScan1730000000000 implements MigrationInterface {
  name = 'CreateSeatsAndOfflineScan1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Seats table
    await queryRunner.createTable(
      new Table({
        name: 'seats',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'tripId', type: 'uuid', isNullable: false },
          { name: 'seatNumber', type: 'varchar', isNullable: false },
          { name: 'status', type: 'enum', enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'UNAVAILABLE'], default: "'AVAILABLE'" },
          { name: 'reservationId', type: 'uuid', isNullable: true },
          { name: 'passengerId', type: 'uuid', isNullable: true },
          { name: 'lockedBy', type: 'varchar', isNullable: true },
          { name: 'lockedAt', type: 'timestamp', isNullable: true },
          { name: 'isWindow', type: 'boolean', default: false },
          { name: 'isAisle', type: 'boolean', default: false },
          { name: 'rowNumber', type: 'integer', default: 1 },
          { name: 'colLetter', type: 'varchar', default: "'A'" },
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
            columnNames: ['reservationId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'reservations',
            onDelete: 'SET NULL',
          },
        ],
        uniques: [
          {
            columnNames: ['tripId', 'seatNumber'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('seats', new TableIndex({
      name: 'IDX_SEATS_TRIP_STATUS',
      columnNames: ['tripId', 'status'],
    }));

    // 2. Offline scans table
    await queryRunner.createTable(
      new Table({
        name: 'offline_scans',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'ticketId', type: 'uuid', isNullable: false },
          { name: 'qrPayload', type: 'text', isNullable: false },
          { name: 'qrSignature', type: 'text', isNullable: false },
          { name: 'status', type: 'enum', enum: ['PENDING_VERIFICATION', 'VERIFIED', 'INVALID', 'CONFLICT'], default: "'PENDING_VERIFICATION'" },
          { name: 'scannedAt', type: 'timestamp', isNullable: false },
          { name: 'scannedBy', type: 'uuid', isNullable: true },
          { name: 'verifiedAt', type: 'timestamp', isNullable: true },
          { name: 'verifiedBy', type: 'uuid', isNullable: true },
          { name: 'latitude', type: 'float', isNullable: true },
          { name: 'longitude', type: 'float', isNullable: true },
          { name: 'deviceId', type: 'varchar', isNullable: true },
          { name: 'deviceName', type: 'varchar', isNullable: true },
          { name: 'syncedAt', type: 'timestamp', isNullable: true },
          { name: 'failureReason', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          {
            columnNames: ['ticketId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tickets',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('offline_scans', new TableIndex({
      name: 'IDX_OFFLINE_SCANS_DEVICE_SYNCED',
      columnNames: ['deviceId', 'syncedAt'],
    }));

    await queryRunner.createIndex('offline_scans', new TableIndex({
      name: 'IDX_OFFLINE_SCANS_TICKET',
      columnNames: ['ticketId'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offline_scans');
    await queryRunner.dropTable('seats');
  }
}
