import { MigrationInterface, QueryRunner, TableIndex, TableColumn } from 'typeorm';

export class CleanupLegacyAgencyReferences1785000000000 implements MigrationInterface {
  name = 'CleanupLegacyAgencyReferences1785000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop legacy FK constraints referencing agencies table from reviews
    await queryRunner.query(`
      DO $$ 
      BEGIN
        PERFORM 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'reviews'
        AND c.confrelid = (SELECT oid FROM pg_class WHERE relname = 'agencies')
        AND c.contype = 'f';
        IF FOUND THEN
          EXECUTE (
            SELECT 'ALTER TABLE reviews DROP CONSTRAINT ' || quote_ident(c.conname)
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'reviews'
            AND c.confrelid = (SELECT oid FROM pg_class WHERE relname = 'agencies')
            AND c.contype = 'f'
            LIMIT 1
          );
        END IF;
      END $$;
    `);

    // 2. Drop legacy FK constraints referencing agencies table from reservations
    await queryRunner.query(`
      DO $$ 
      BEGIN
        PERFORM 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'reservations'
        AND c.confrelid = (SELECT oid FROM pg_class WHERE relname = 'agencies')
        AND c.contype = 'f';
        IF FOUND THEN
          EXECUTE (
            SELECT 'ALTER TABLE reservations DROP CONSTRAINT ' || quote_ident(c.conname)
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'reservations'
            AND c.confrelid = (SELECT oid FROM pg_class WHERE relname = 'agencies')
            AND c.contype = 'f'
            LIMIT 1
          );
        END IF;
      END $$;
    `);

    // 3. Add centreId column to entities that might be missing it
    for (const table of ['buses', 'routes', 'trips']) {
      const hasColumn = await queryRunner.hasColumn(table, 'centreId');
      if (!hasColumn) {
        await queryRunner.addColumn(table, new TableColumn({
          name: 'centreId',
          type: 'uuid',
          isNullable: true,
        }));
      }
    }

    // 4. Add indexes on centreId for query performance
    const centreIdIndexes = [
      { table: 'buses', index: 'IDX_BUSES_CENTRE_ID' },
      { table: 'routes', index: 'IDX_ROUTES_CENTRE_ID' },
      { table: 'trips', index: 'IDX_TRIPS_CENTRE_ID' },
      { table: 'reviews', index: 'IDX_REVIEWS_CENTRE_ID' },
      { table: 'reservations', index: 'IDX_RESERVATIONS_CENTRE_ID' },
      { table: 'users', index: 'IDX_USERS_CENTRE_ID' },
    ];

    for (const { table, index } of centreIdIndexes) {
      const hasIndex = await queryRunner.query(
        `SELECT 1 FROM pg_indexes WHERE tablename = '${table}' AND indexname = '${index}'`,
      );
      if (hasIndex.length === 0) {
        await queryRunner.createIndex(table, new TableIndex({
          name: index,
          columnNames: ['centreId'],
        }));
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropping indexes (best-effort with catch)
    const centreIdIndexes = [
      { table: 'buses', index: 'IDX_BUSES_CENTRE_ID' },
      { table: 'routes', index: 'IDX_ROUTES_CENTRE_ID' },
      { table: 'trips', index: 'IDX_TRIPS_CENTRE_ID' },
      { table: 'reviews', index: 'IDX_REVIEWS_CENTRE_ID' },
      { table: 'reservations', index: 'IDX_RESERVATIONS_CENTRE_ID' },
      { table: 'users', index: 'IDX_USERS_CENTRE_ID' },
    ];
    for (const { table, index } of centreIdIndexes) {
      await queryRunner.dropIndex(table, index).catch(() => {});
    }
  }
}
