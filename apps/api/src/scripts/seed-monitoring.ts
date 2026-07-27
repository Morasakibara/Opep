/**
 * Script CLI : Seed des erreurs de monitoring
 *
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/seed-monitoring.ts
 *
 * Crée 10 erreurs de test dans la table api_errors pour valider
 * les filtres de la page /monitoring.
 */

import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/typeorm.config';
import { MONITORING_SEED_ERRORS } from '../modules/monitoring/seed-data';

async function seed() {
  const ds = new DataSource(dataSourceOptions);
  await ds.initialize();
  console.log('[SEED-MONITORING] Connected to database');

  // Clear existing errors first
  await ds.query('DELETE FROM api_errors');
  console.log('[SEED-MONITORING] Cleared existing errors');

  // Insert seed errors
  for (const err of MONITORING_SEED_ERRORS) {
    await ds.query(
      `INSERT INTO api_errors (id, "createdAt", "updatedAt", method, url, "statusCode", message)
       VALUES (gen_random_uuid(), NOW() - interval '${Math.floor(Math.random() * 60)} minutes', NOW(), $1, $2, $3, $4)`,
      [err.method, err.url, err.statusCode, err.message],
    );
  }
  console.log(`[SEED-MONITORING] ✅ ${MONITORING_SEED_ERRORS.length} errors seeded successfully`);

  await ds.destroy();
  console.log('[SEED-MONITORING] Done!');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[SEED-MONITORING] ❌ Failed:', err.message);
    process.exit(1);
  });
