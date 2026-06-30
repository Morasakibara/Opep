import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../../.env') });

import { UserRole, NotificationChannel, Language } from '@opep/shared-types';
import { User } from './modules/users/entities/user.entity';
import { Agency, SubscriptionPlan } from './modules/agencies/entities/agency.entity';
import { Bus } from './modules/buses/entities/bus.entity';
import { Route } from './modules/routes/entities/route.entity';
import { Trip, TripStatus } from './modules/trips/entities/trip.entity';
import { dataSourceOptions } from './config/typeorm.config';

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('[SEED] Database connected');

  const userRepo = dataSource.getRepository(User);
  const agencyRepo = dataSource.getRepository(Agency);
  const busRepo = dataSource.getRepository(Bus);
  const routeRepo = dataSource.getRepository(Route);
  const tripRepo = dataSource.getRepository(Trip);

  // Check if data already exists
  const existingCount = await agencyRepo.count();
  if (existingCount > 0) {
    console.log('[SEED] Data already exists, skipping seed');
    console.log('[SEED] To re-seed, run: TRUNCATE agencies, users, buses, routes, trips CASCADE; then re-run seed');
    await dataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash('123456', 10);

  // === AGENCIES ===
  const agencies = await agencyRepo.save([
    { name: 'Finexs Voyages', address: 'Akwa', city: 'Douala', phone: '+237 670 000 001', email: 'contact@finexs.cm', logoUrl: '', subscriptionPlan: SubscriptionPlan.PREMIUM },
    { name: 'General Express', address: 'Mvan', city: 'Yaounde', phone: '+237 670 000 002', email: 'info@generalexpress.cm', logoUrl: '', subscriptionPlan: SubscriptionPlan.BASIC },
    { name: 'Touristique Voyages', address: 'Centre', city: 'Garoua', phone: '+237 670 000 003', email: 'contact@touristique.cm', logoUrl: '', subscriptionPlan: SubscriptionPlan.BASIC },
  ]);
  console.log(`[SEED] ${agencies.length} agencies created`);

  // === USERS ===
  const users = await userRepo.save([
    { firstName: 'Admin', lastName: 'OPEP', phone: '+237600000000', email: 'admin@opep.cm', passwordHash, role: UserRole.ADMIN_PLATFORM, isActive: true },
    { firstName: 'Jean', lastName: 'Ngom', phone: '+237670000001', email: 'jean@finexs.cm', passwordHash, role: UserRole.AGENCY_MANAGER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Marie', lastName: 'Bella', phone: '+237670000002', email: 'marie@finexs.cm', passwordHash, role: UserRole.CONTROLLER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Paul', lastName: 'Emana', phone: '+237670000003', email: 'paul@express.cm', passwordHash, role: UserRole.AGENCY_MANAGER, isActive: true, agencyId: agencies[1].id },
    { firstName: 'Adrian', lastName: 'Doe', phone: '+237690000000', email: 'adrian@email.com', passwordHash, role: UserRole.CLIENT, isActive: true },
    { firstName: 'Samuel', lastName: 'Eto\'o', phone: '+237690000001', email: 'samuel@email.com', passwordHash, role: UserRole.CLIENT, isActive: true },
  ]);
  console.log(`[SEED] ${users.length} users created`);
  console.log('[SEED] Mot de passe par defaut: 123456');

  // === BUSES ===
  const buses = await busRepo.save([
    { agencyId: agencies[0].id, plateNumber: 'LT-001-AA', model: 'Mercedes-Benz Travego', totalSeats: 70, seatLayout: { rows: 17, cols: 4, unavailableSeats: [] } },
    { agencyId: agencies[0].id, plateNumber: 'LT-002-AB', model: 'Mercedes-Benz Travego', totalSeats: 70, seatLayout: { rows: 17, cols: 4, unavailableSeats: [] } },
    { agencyId: agencies[0].id, plateNumber: 'LT-003-AC', model: 'Toyota Coaster', totalSeats: 30, seatLayout: { rows: 10, cols: 3, unavailableSeats: [] } },
    { agencyId: agencies[1].id, plateNumber: 'LT-004-BA', model: 'Hyundai County', totalSeats: 30, seatLayout: { rows: 10, cols: 3, unavailableSeats: [] } },
    { agencyId: agencies[1].id, plateNumber: 'LT-005-BB', model: 'Isuzu NQR', totalSeats: 45, seatLayout: { rows: 12, cols: 4, unavailableSeats: [] } },
    { agencyId: agencies[2].id, plateNumber: 'LT-006-CA', model: 'Mercedes-Benz Sprinter', totalSeats: 20, seatLayout: { rows: 7, cols: 3, unavailableSeats: [] } },
  ]);
  console.log(`[SEED] ${buses.length} buses created`);

  // === ROUTES ===
  const routes = await routeRepo.save([
    { agencyId: agencies[0].id, departureCity: 'Yaounde', arrivalCity: 'Douala', distanceKm: 240, estimatedDurationMinutes: 270 },
    { agencyId: agencies[0].id, departureCity: 'Yaounde', arrivalCity: 'Bafoussam', distanceKm: 290, estimatedDurationMinutes: 300 },
    { agencyId: agencies[0].id, departureCity: 'Douala', arrivalCity: 'Kribi', distanceKm: 170, estimatedDurationMinutes: 180 },
    { agencyId: agencies[1].id, departureCity: 'Douala', arrivalCity: 'Yaounde', distanceKm: 240, estimatedDurationMinutes: 270 },
    { agencyId: agencies[1].id, departureCity: 'Douala', arrivalCity: 'Bafoussam', distanceKm: 200, estimatedDurationMinutes: 240 },
    { agencyId: agencies[2].id, departureCity: 'Yaounde', arrivalCity: 'Garoua', distanceKm: 800, estimatedDurationMinutes: 600 },
  ]);
  console.log(`[SEED] ${routes.length} routes created`);

  // === TRIPS ===
  const now = new Date();
  const trips = await tripRepo.save([
    { agencyId: agencies[0].id, routeId: routes[0].id, busId: buses[0].id, driverId: users[2].id, departureDateTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), arrivalDateTime: new Date(now.getTime() + 2 * 60 * 60 * 1000 + 270 * 60 * 1000), basePrice: 6000, status: TripStatus.SCHEDULED },
    { agencyId: agencies[0].id, routeId: routes[0].id, busId: buses[1].id, driverId: users[2].id, departureDateTime: new Date(now.getTime() + 8 * 60 * 60 * 1000), arrivalDateTime: new Date(now.getTime() + 8 * 60 * 60 * 1000 + 270 * 60 * 1000), basePrice: 6000, status: TripStatus.SCHEDULED },
    { agencyId: agencies[0].id, routeId: routes[1].id, busId: buses[0].id, departureDateTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), arrivalDateTime: new Date(now.getTime() + 4 * 60 * 60 * 1000 + 300 * 60 * 1000), basePrice: 5000, status: TripStatus.SCHEDULED },
    { agencyId: agencies[0].id, routeId: routes[2].id, busId: buses[2].id, departureDateTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), arrivalDateTime: new Date(now.getTime() + 6 * 60 * 60 * 1000 + 180 * 60 * 1000), basePrice: 3000, status: TripStatus.SCHEDULED },
    { agencyId: agencies[1].id, routeId: routes[3].id, busId: buses[3].id, departureDateTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), arrivalDateTime: new Date(now.getTime() + 3 * 60 * 60 * 1000 + 270 * 60 * 1000), basePrice: 5500, status: TripStatus.SCHEDULED },
  ]);
  console.log(`[SEED] ${trips.length} trips created`);

  console.log('[SEED] ✅ Seed completed successfully!');
  console.log('');
  console.log('=== Comptes demo ===');
  console.log('Admin:     +237600000000 / 123456');
  console.log('Manager:   +237670000001 (Finexs) / 123456');
  console.log('Client:    +237690000000 / 123456');
  console.log('Client 2:  +237690000001 / 123456');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('[SEED] ❌ Seed failed:', err.message);
  process.exit(1);
});
