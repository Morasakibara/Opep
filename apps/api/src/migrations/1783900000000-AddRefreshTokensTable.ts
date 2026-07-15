import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddRefreshTokensTable1783900000000 implements MigrationInterface {
  name = 'AddRefreshTokensTable1783900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'userId', type: 'uuid', isNullable: false },
          { name: 'tokenHash', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'expiresAt', type: 'timestamp', isNullable: false },
          { name: 'isRevoked', type: 'boolean', default: false },
          { name: 'revokedAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
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

    await queryRunner.createIndex('refresh_tokens', new TableIndex({
      name: 'IDX_REFRESH_TOKENS_USER',
      columnNames: ['userId'],
    }));

    await queryRunner.createIndex('refresh_tokens', new TableIndex({
      name: 'IDX_REFRESH_TOKENS_TOKEN_HASH',
      columnNames: ['tokenHash'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('refresh_tokens');
  }
}
