import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateApiErrorsTable1740000000000 implements MigrationInterface {
  name = 'CreateApiErrorsTable1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'api_errors',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'method',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'url',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'statusCode',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'stack',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex('api_errors', new TableIndex({
      name: 'IDX_API_ERRORS_STATUS_CREATED',
      columnNames: ['statusCode', 'createdAt'],
    }));

    await queryRunner.createIndex('api_errors', new TableIndex({
      name: 'IDX_API_ERRORS_CREATED',
      columnNames: ['createdAt'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('api_errors', 'IDX_API_ERRORS_CREATED');
    await queryRunner.dropIndex('api_errors', 'IDX_API_ERRORS_STATUS_CREATED');
    await queryRunner.dropTable('api_errors');
  }
}
