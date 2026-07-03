import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../../.env') });

import { UserRole, SubscriptionPlan } from '@opep/shared-types';
import { Algorithm, hash as argon2Hash } from '@node-rs/argon2';
import { User } from './modules/users/entities/user.entity';
import { Agency } from './modules/agencies/entities/agency.entity';
import { Bus } from './modules/buses/entities/bus.entity';
import { Route } from './modules/routes/entities/route.entity';
import { Trip, TripStatus } from './modules/trips/entities/trip.entity';
import { Reservation, ReservationStatus, ReservationType } from './modules/reservations/entities/reservation.entity';
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
  const reservationRepo = dataSource.getRepository(Reservation);

  // Clear existing data
  console.log('[SEED] Cleaning database...');
  await dataSource.query('TRUNCATE agencies, users, buses, routes, trips, reservations CASCADE');

  const passwordHash = await argon2Hash('123456', {
    algorithm: Algorithm.Argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  // === AGENCIES ===
  const agencyData = [
    { name: 'Finexs Voyages', address: 'Akwa', city: 'Douala', phone: '+237 670 000 001', email: 'contact@finexs.cm', subscriptionPlan: SubscriptionPlan.PREMIUM },
    { name: 'General Express', address: 'Mvan', city: 'Yaounde', phone: '+237 670 000 002', email: 'info@generalexpress.cm', subscriptionPlan: SubscriptionPlan.BASIC },
    { name: 'Touristique Voyages', address: 'Centre', city: 'Garoua', phone: '+237 670 000 003', email: 'contact@touristique.cm', subscriptionPlan: SubscriptionPlan.BASIC },
    { name: 'Buca Voyages', address: 'Mvan', city: 'Yaounde', phone: '+237 670 000 004', email: 'buca@voyages.cm', subscriptionPlan: SubscriptionPlan.PREMIUM },
    { name: 'Global Voyages', address: 'Bonaberi', city: 'Douala', phone: '+237 670 000 005', email: 'global@voyages.cm', subscriptionPlan: SubscriptionPlan.BASIC },
  ];
  const agencies = await agencyRepo.save(agencyRepo.create(agencyData));
  console.log(`[SEED] ${agencies.length} agencies created`);

  // === USERS (Staff & Admin) ===
  const userData = [
    { firstName: 'Super', lastName: 'Admin', phone: '+237600000000', email: 'admin@opep.cm', passwordHash, role: UserRole.ADMIN_PLATFORM, isActive: true },
    { firstName: 'Manager', lastName: 'Finexs', phone: '+237670000010', email: 'manager@finexs.cm', passwordHash, role: UserRole.AGENCY_MANAGER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Caissier', lastName: 'Finexs 1', phone: '+237670000011', email: 'caisse1@finexs.cm', passwordHash, role: UserRole.CASHIER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Controleur', lastName: 'Finexs 1', phone: '+237670000012', email: 'ctrl1@finexs.cm', passwordHash, role: UserRole.CONTROLLER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Chauffeur', lastName: 'Finexs 1', phone: '+237670000013', email: 'driver1@finexs.cm', passwordHash, role: UserRole.DRIVER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Manager', lastName: 'Buca', phone: '+237670000020', email: 'manager@buca.cm', passwordHash, role: UserRole.AGENCY_MANAGER, isActive: true, agencyId: agencies[3].id },
    { firstName: 'Caissier', lastName: 'Buca 1', phone: '+237670000021', email: 'caisse1@buca.cm', passwordHash, role: UserRole.CASHIER, isActive: true, agencyId: agencies[3].id },
    { firstName: 'Adrian', lastName: 'Client', phone: '+237690000000', email: 'adrian@email.com', passwordHash, role: UserRole.CLIENT, isActive: true },
    { firstName: 'Samuel', lastName: 'Client', phone: '+237690000001', email: 'samuel@email.com', passwordHash, role: UserRole.CLIENT, isActive: true },
  ];
  const users = await userRepo.save(userRepo.create(userData));
  console.log(`[SEED] ${users.length} users created`);

  // === BUSES ===
  const busData = [
    { agencyId: agencies[0].id, plateNumber: 'LT-001-AA', model: 'Mercedes-Benz Travego', totalSeats: 70 },
    { agencyId: agencies[0].id, plateNumber: 'LT-002-AB', model: 'Mercedes-Benz Travego', totalSeats: 70 },
    { agencyId: agencies[3].id, plateNumber: 'CE-999-ZA', model: 'Scania Touring', totalSeats: 65 },
  ];
  const buses = await busRepo.save(busRepo.create(busData));

  // === ROUTES ===
  const routeData = [
    { agencyId: agencies[0].id, departureCity: 'Douala', arrivalCity: 'Yaounde', distanceKm: 240, estimatedDurationMinutes: 270 },
    { agencyId: agencies[3].id, departureCity: 'Yaounde', arrivalCity: 'Douala', distanceKm: 240, estimatedDurationMinutes: 270 },
  ];
  const routes = await routeRepo.save(routeRepo.create(routeData));

  // === TRIPS (Past & Future for Stats) ===
  const now = new Date();
  const tripData = [];
  
  for (let i = -10; i < 10; i++) {
    const departure = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    tripData.push({
      agencyId: agencies[i % 2 === 0 ? 0 : 3].id,
      routeId: routes[i % 2 === 0 ? 0 : 1].id,
      busId: buses[i % 2 === 0 ? 0 : 2].id,
      departureDateTime: departure,
      arrivalDateTime: new Date(departure.getTime() + 270 * 60 * 1000),
      basePrice: Math.floor(3000 + (Math.random() * 2000)),
      status: i < 0 ? TripStatus.COMPLETED : TripStatus.SCHEDULED,
    });
  }
  const savedTrips = await tripRepo.save(tripRepo.create(tripData));
  console.log(`[SEED] ${savedTrips.length} trips created`);

  // === RESERVATIONS (Revenue Data) ===
  const resData = [];
  const clientUser = users.find(u => u.role === UserRole.CLIENT);
  
  if (clientUser) {
    for (const trip of savedTrips) {
      const resCount = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < resCount; j++) {
        resData.push({
          reservationCode: `R-${trip.id.substring(0,4)}-${j}-${Math.random().toString(36).substring(7)}`,
          tripId: trip.id,
          clientId: clientUser.id,
          agencyId: trip.agencyId,
          type: ReservationType.INDIVIDUAL,
          totalAmount: trip.basePrice,
          status: ReservationStatus.CONFIRMED,
          createdByRole: UserRole.CASHIER,
          createdAt: trip.departureDateTime,
        });
      }
    }
    await reservationRepo.save(reservationRepo.create(resData));
    console.log(`[SEED] ${resData.length} reservations created for revenue simulation`);
  }

  console.log('[SEED] ✅ Full seed completed successfully!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('[SEED] ❌ Seed failed:', err.stack);
  process.exit(1);
});
