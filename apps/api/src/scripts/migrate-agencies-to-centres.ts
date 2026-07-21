/**
 * Script de migration : Transfère les données legacy des agences vers les compagnies/centres.
 *
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/migrate-agencies-to-centres.ts
 *
 * Actions :
 * 1. Crée une compagnie pour chaque agence active (si pas déjà présente)
 * 2. Crée un centre pour chaque agence (rattaché à la compagnie)
 * 3. Met à jour les bus, routes, trajets, réservations, avis pointant vers agencyId
 *    pour qu'ils aient aussi un centreId
 */

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { dataSourceOptions } from '../config/typeorm.config';

dotenv.config({ path: join(__dirname, '../../.env') });
dotenv.config({ path: join(__dirname, '../../../.env') });

async function migrate() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('[MIGRATE] Database connected');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // 1. Lire toutes les agences actives
    const agencies = await queryRunner.query(
      `SELECT id, name, address, city, phone, email, "logoUrl", "isActive" FROM agencies WHERE "isActive" = true`,
    );
    console.log(`[MIGRATE] Found ${agencies.length} active agencies`);

    let companiesCreated = 0;
    let centresCreated = 0;
    let busesUpdated = 0;
    let tripsUpdated = 0;
    let reservationsUpdated = 0;
    let reviewsUpdated = 0;

    for (const agency of agencies) {
      // 2. Vérifier si une compagnie avec ce nom existe déjà
      const existingCompany = await queryRunner.query(
        `SELECT id FROM companies WHERE name = $1 LIMIT 1`,
        [agency.name],
      );

      let companyId: string;

      if (existingCompany.length === 0) {
        // Créer une compagnie
        const result = await queryRunner.query(
          `INSERT INTO companies (id, name, address, city, phone, email, "logoUrl", "isActive", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
           RETURNING id`,
          [agency.name, agency.address, agency.city, agency.phone, agency.email, agency.logoUrl || null, agency.isActive],
        );
        companyId = result[0].id;
        companiesCreated++;
        console.log(`  → Created company: ${agency.name} (${companyId})`);
      } else {
        companyId = existingCompany[0].id;
        console.log(`  → Company already exists: ${agency.name} (${companyId})`);
      }

      // 3. Vérifier si un centre existe déjà pour cette agence
      const existingCentre = await queryRunner.query(
        `SELECT id FROM centres WHERE name LIKE $1 AND "companyId" = $2 LIMIT 1`,
        [`%${agency.name}%`, companyId],
      );

      let centreId: string;

      if (existingCentre.length === 0) {
        // Créer un centre basé sur l'agence
        const result = await queryRunner.query(
          `INSERT INTO centres (id, "companyId", name, city, address, phone, email, "isActive", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
           RETURNING id`,
          [companyId, `Agence ${agency.name} - ${agency.city}`, agency.city, agency.address, agency.phone, agency.email, agency.isActive],
        );
        centreId = result[0].id;
        centresCreated++;
        console.log(`  → Created centre: ${agency.name} (${centreId})`);
      } else {
        centreId = existingCentre[0].id;
        console.log(`  → Centre already exists: ${centreId}`);
      }

      // 4. Mettre à jour les bus qui ont agencyId mais pas centreId
      const busResult = await queryRunner.query(
        `UPDATE buses SET "centreId" = $1 WHERE "agencyId" = $2 AND "centreId" IS NULL`,
        [centreId, agency.id],
      );
      busesUpdated += busResult[1] || 0;

      // 5. Mettre à jour les routes qui ont agencyId mais pas centreId
      const routeResult = await queryRunner.query(
        `UPDATE routes SET "centreId" = $1 WHERE "agencyId" = $2 AND "centreId" IS NULL`,
        [centreId, agency.id],
      ).catch(() => [null, 0]); // Ignorer si colonne manquante

      // 6. Mettre à jour les trajets qui ont agencyId mais pas centreId
      const tripResult = await queryRunner.query(
        `UPDATE trips SET "centreId" = $1 WHERE "agencyId" = $2 AND "centreId" IS NULL`,
        [centreId, agency.id],
      );
      tripsUpdated += tripResult[1] || 0;

      // 7. Mettre à jour les réservations qui ont agencyId mais pas centreId
      const resResult = await queryRunner.query(
        `UPDATE reservations SET "centreId" = $1 WHERE "agencyId" = $2 AND "centreId" IS NULL`,
        [centreId, agency.id],
      );
      reservationsUpdated += resResult[1] || 0;

      // 8. Mettre à jour les avis qui ont agencyId mais pas centreId
      const reviewResult = await queryRunner.query(
        `UPDATE reviews SET "centreId" = $1 WHERE "agencyId" = $2 AND "centreId" IS NULL`,
        [centreId, agency.id],
      );
      reviewsUpdated += reviewResult[1] || 0;
    }

    // 9. Commit transaction
    await queryRunner.commitTransaction();

    console.log('\n═══════════════════════════════════════');
    console.log('  [MIGRATE] ✅ Migration completed');
    console.log('═══════════════════════════════════════');
    console.log(`  Companies created: ${companiesCreated}`);
    console.log(`  Centres created:   ${centresCreated}`);
    console.log(`  Buses updated:     ${busesUpdated}`);
    console.log(`  Trips updated:     ${tripsUpdated}`);
    console.log(`  Reservations updated: ${reservationsUpdated}`);
    console.log(`  Reviews updated:   ${reviewsUpdated}`);
    console.log('═══════════════════════════════════════\n');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('[MIGRATE] ❌ Migration failed:', err);
    throw err;
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

migrate().catch((err) => {
  console.error('[MIGRATE] ❌ Fatal error:', err.message);
  process.exit(1);
});
