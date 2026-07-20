import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../../.env') });

import { UserRole } from '@opep/shared-types';
import { Algorithm, hash as argon2Hash } from '@node-rs/argon2';
import { User } from './modules/users/entities/user.entity';
import { Agency, SubscriptionPlan as AgencySubscriptionPlan } from './modules/agencies/entities/agency.entity';
import { Company } from './modules/companies/entities/company.entity';
import { Centre } from './modules/centres/entities/centre.entity';
import { Subscription } from './modules/subscriptions/subscriptions.entity';
import { Invoice } from './modules/billings/entities/invoice.entity';
import { Complaint, ComplaintCategory, ComplaintStatus } from './modules/complaints/entities/complaint.entity';
import { Bus } from './modules/buses/entities/bus.entity';
import { Route } from './modules/routes/entities/route.entity';
import { Trip, TripStatus } from './modules/trips/entities/trip.entity';
import { Reservation, ReservationStatus, ReservationType } from './modules/reservations/entities/reservation.entity';
import { dataSourceOptions } from './config/typeorm.config';
import { InvoiceStatus } from '@opep/shared-types';

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('[SEED] Database connected');

  const userRepo = dataSource.getRepository(User);
  const agencyRepo = dataSource.getRepository(Agency);
  const companyRepo = dataSource.getRepository(Company);
  const centreRepo = dataSource.getRepository(Centre);
  const subscriptionRepo = dataSource.getRepository(Subscription);
  const invoiceRepo = dataSource.getRepository(Invoice);
  const complaintRepo = dataSource.getRepository(Complaint);
  const busRepo = dataSource.getRepository(Bus);
  const routeRepo = dataSource.getRepository(Route);
  const tripRepo = dataSource.getRepository(Trip);
  const reservationRepo = dataSource.getRepository(Reservation);

  // Clear existing data (respect FK order: children first, parents last)
  console.log('[SEED] Cleaning database...');
  await dataSource.query('TRUNCATE invoices, complaints, subscriptions, centres, companies, reservations, trips, buses, routes, agencies, users CASCADE');

  const passwordHash = await argon2Hash('123456', {
    algorithm: Algorithm.Argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  // ========================================================================
  // AGENCIES (legacy — kept for backward compatibility)
  // ========================================================================
  const agencyData = [
    { name: 'Finexs Voyages', address: 'Akwa', city: 'Douala', phone: '+237 670 000 001', email: 'contact@finexs.cm', subscriptionPlan: AgencySubscriptionPlan.PREMIUM },
    { name: 'General Express', address: 'Mvan', city: 'Yaoundé', phone: '+237 670 000 002', email: 'info@generalexpress.cm', subscriptionPlan: AgencySubscriptionPlan.BASIC },
    { name: 'Touristique Voyages', address: 'Centre', city: 'Garoua', phone: '+237 670 000 003', email: 'contact@touristique.cm', subscriptionPlan: AgencySubscriptionPlan.BASIC },
    { name: 'Buca Voyages', address: 'Mvan', city: 'Yaoundé', phone: '+237 670 000 004', email: 'buca@voyages.cm', subscriptionPlan: AgencySubscriptionPlan.PREMIUM },
    { name: 'Global Voyages', address: 'Bonaberi', city: 'Douala', phone: '+237 670 000 005', email: 'global@voyages.cm', subscriptionPlan: AgencySubscriptionPlan.BASIC },
  ];
  const agencies = await agencyRepo.save(agencyRepo.create(agencyData));
  console.log(`[SEED] ${agencies.length} agencies created`);

  // ========================================================================
  // USERS
  // ========================================================================
  const userData = [
    // Platform admin
    { firstName: 'Super', lastName: 'Admin', phone: '+237600000000', email: 'admin@opep.cm', passwordHash, role: UserRole.ADMIN_PLATFORM, isActive: true },
    // Agency staff
    { firstName: 'Manager', lastName: 'Finexs', phone: '+237670000010', email: 'manager@finexs.cm', passwordHash, role: UserRole.AGENCY_MANAGER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Caissier', lastName: 'Finexs 1', phone: '+237670000011', email: 'caisse1@finexs.cm', passwordHash, role: UserRole.CASHIER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Controleur', lastName: 'Finexs 1', phone: '+237670000012', email: 'ctrl1@finexs.cm', passwordHash, role: UserRole.CONTROLLER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Chauffeur', lastName: 'Finexs 1', phone: '+237670000013', email: 'driver1@finexs.cm', passwordHash, role: UserRole.DRIVER, isActive: true, agencyId: agencies[0].id },
    { firstName: 'Manager', lastName: 'Buca', phone: '+237670000020', email: 'manager@buca.cm', passwordHash, role: UserRole.AGENCY_MANAGER, isActive: true, agencyId: agencies[3].id },
    { firstName: 'Caissier', lastName: 'Buca 1', phone: '+237670000021', email: 'caisse1@buca.cm', passwordHash, role: UserRole.CASHIER, isActive: true, agencyId: agencies[3].id },
    // Company directors
    { firstName: 'Paul', lastName: 'Biya', phone: '+237690000010', email: 'paul.biya@opep-express.cm', passwordHash, role: UserRole.COMPANY_DIRECTOR, isActive: true },
    { firstName: 'Esther', lastName: 'Njike', phone: '+237690000011', email: 'esther.njike@star-co.cm', passwordHash, role: UserRole.COMPANY_DIRECTOR, isActive: true },
    // Centre managers
    { firstName: 'Jean', lastName: 'Mballa', phone: '+237690000020', email: 'jean.mballa@opep-express.cm', passwordHash, role: UserRole.CENTRE_MANAGER, isActive: true },
    // Clients
    { firstName: 'Adrian', lastName: 'Client', phone: '+237690000000', email: 'adrian@email.com', passwordHash, role: UserRole.CLIENT, isActive: true },
    { firstName: 'Samuel', lastName: 'Client', phone: '+237690000001', email: 'samuel@email.com', passwordHash, role: UserRole.CLIENT, isActive: true },
  ];
  const users = await userRepo.save(userRepo.create(userData));
  console.log(`[SEED] ${users.length} users created`);

  // Helper to find users by role
  const adminUser = users.find(u => u.role === UserRole.ADMIN_PLATFORM)!;
  const director1 = users.find(u => u.role === UserRole.COMPANY_DIRECTOR && u.email?.includes('paul'))!;
  const director2 = users.find(u => u.role === UserRole.COMPANY_DIRECTOR && u.email?.includes('esther'))!;
  const centreManager1 = users.find(u => u.role === UserRole.CENTRE_MANAGER)!;
  const client1 = users.find(u => u.email === 'adrian@email.com')!;
  const client2 = users.find(u => u.email === 'samuel@email.com')!;

  // ========================================================================
  // COMPANIES
  // ========================================================================
  const companyData = [
    { name: 'OPEP Express', address: 'Boulevard de la Liberté', city: 'Douala', phone: '+237 670 100 001', email: 'contact@opep-express.cm', directorUserId: director1.id, isActive: true, publicRatingAverage: 4.2, reviewsCount: 156 },
    { name: 'Star Company Voyages', address: 'Avenue Kennedy', city: 'Yaoundé', phone: '+237 670 100 002', email: 'info@star-co.cm', directorUserId: director2.id, isActive: true, publicRatingAverage: 3.8, reviewsCount: 89 },
    { name: 'Trans-Fret Logistics', address: 'Quartier Industriel', city: 'Douala', phone: '+237 670 100 003', email: 'contact@transfret.cm', directorUserId: null, isActive: true, publicRatingAverage: null, reviewsCount: 0 },
  ];
  const companies = await companyRepo.save(companyRepo.create(companyData));
  console.log(`[SEED] ${companies.length} companies created`);

  // ========================================================================
  // CENTRES
  // ========================================================================
  const centreData = [
    { companyId: companies[0].id, name: 'Gare de Douala - Bonabéri', city: 'Douala', address: 'Bonabéri', phone: '+237 670 200 001', email: 'douala@opep-express.cm', managerUserId: centreManager1.id, isActive: true, cancellationPenaltyPercent: 15, maxFreeReports: 3, minDepositPercent: 30 },
    { companyId: companies[0].id, name: 'Gare de Yaoundé - Mvan', city: 'Yaoundé', address: 'Mvan', phone: '+237 670 200 002', email: 'yaounde@opep-express.cm', managerUserId: null, isActive: true, cancellationPenaltyPercent: 10, maxFreeReports: 5, minDepositPercent: 30 },
    { companyId: companies[0].id, name: 'Gare de Bafoussam', city: 'Bafoussam', address: 'Centre-ville', phone: '+237 670 200 003', email: 'bafoussam@opep-express.cm', managerUserId: null, isActive: false, cancellationPenaltyPercent: 20, maxFreeReports: 2, minDepositPercent: 50 },
    { companyId: companies[1].id, name: 'Agence Centrale Yaoundé', city: 'Yaoundé', address: 'Centre-ville', phone: '+237 670 200 010', email: 'central@star-co.cm', managerUserId: null, isActive: true, cancellationPenaltyPercent: 25, maxFreeReports: 4, minDepositPercent: 40 },
  ];
  const centres = await centreRepo.save(centreRepo.create(centreData));
  console.log(`[SEED] ${centres.length} centres created`);

  // ========================================================================
  // SUBSCRIPTIONS
  // ========================================================================
  const now = new Date();
  const subscriptionData = [
    { companyId: companies[0].id, planName: 'PREMIUM', price: 250000, status: 'ACTIVE', startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), endDate: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000) },
    { companyId: companies[1].id, planName: 'STARTER', price: 75000, status: 'ACTIVE', startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), endDate: new Date(now.getTime() + 350 * 24 * 60 * 60 * 1000) },
    { companyId: companies[2].id, planName: 'FREE_TRIAL', price: 0, status: 'TRIALING', startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000) },
  ];
  const subscriptions = await subscriptionRepo.save(subscriptionRepo.create(subscriptionData));
  console.log(`[SEED] ${subscriptions.length} subscriptions created`);

  // ========================================================================
  // INVOICES
  // ========================================================================
  const invoiceData = [
    { companyId: companies[0].id, subscriptionId: subscriptions[0].id, periodStart: new Date(now.getFullYear(), now.getMonth(), 1), periodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0), amount: 250000, status: InvoiceStatus.PAID, issuedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), paidAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000) },
    { companyId: companies[0].id, subscriptionId: subscriptions[0].id, periodStart: new Date(now.getFullYear(), now.getMonth() + 1, 1), periodEnd: new Date(now.getFullYear(), now.getMonth() + 2, 0), amount: 250000, status: InvoiceStatus.UNPAID, issuedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), paidAt: null },
    { companyId: companies[1].id, subscriptionId: subscriptions[1].id, periodStart: new Date(now.getFullYear(), now.getMonth(), 1), periodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0), amount: 75000, status: InvoiceStatus.PAID, issuedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), paidAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000) },
  ];
  const invoices = await invoiceRepo.save(invoiceRepo.create(invoiceData));
  console.log(`[SEED] ${invoices.length} invoices created`);

  // ========================================================================
  // COMPLAINTS
  // ========================================================================
  const complaintData = [
    { tripId: null, reservationId: null, clientId: client1.id, centreId: centres[0].id, companyId: companies[0].id, category: ComplaintCategory.RETARD, description: 'Le bus est arrivé avec 45 minutes de retard sans aucune communication.', status: ComplaintStatus.OPEN, assignedToUserId: null, response: null, resolvedAt: null },
    { tripId: null, reservationId: null, clientId: client2.id, centreId: centres[3].id, companyId: companies[1].id, category: ComplaintCategory.COMPORTEMENT_CHAUFFEUR, description: 'Le chauffeur conduisait de manière dangereuse, téléphone en main.', status: ComplaintStatus.IN_PROGRESS, assignedToUserId: adminUser.id, response: 'En cours de traitement avec le responsable de la flotte.', resolvedAt: null },
    { tripId: null, reservationId: null, clientId: client2.id, centreId: centres[1].id, companyId: companies[0].id, category: ComplaintCategory.SERVICE_GUICHET, description: 'La caissière était impolie et a refusé de donner un reçu.', status: ComplaintStatus.RESOLVED, assignedToUserId: adminUser.id, response: 'La caissière a été sensibilisée. Veuillez nous excuser pour ce désagrément.', resolvedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
  ];
  const complaints = await complaintRepo.save(complaintRepo.create(complaintData));
  console.log(`[SEED] ${complaints.length} complaints created`);

  // ========================================================================
  // BUSES
  // ========================================================================
  const busData = [
    { agencyId: agencies[0].id, centreId: centres[0].id, plateNumber: 'LT-001-AA', model: 'Mercedes-Benz Travego', totalSeats: 70, seatLayout: { rows: 14, cols: 4, lastRowCols: 2, unavailableSeats: [] } },
    { agencyId: agencies[0].id, centreId: centres[1].id, plateNumber: 'LT-002-AB', model: 'Mercedes-Benz Travego', totalSeats: 70, seatLayout: { rows: 14, cols: 4, lastRowCols: 2, unavailableSeats: [] } },
    { agencyId: agencies[3].id, centreId: centres[3].id, plateNumber: 'CE-999-ZA', model: 'Scania Touring', totalSeats: 65, seatLayout: { rows: 13, cols: 4, lastRowCols: 1, unavailableSeats: [] } },
  ];
  const buses = await busRepo.save(busRepo.create(busData));
  console.log(`[SEED] ${buses.length} buses created`);

  // ========================================================================
  // ROUTES
  // ========================================================================
  const routeData = [
    { agencyId: agencies[0].id, centreId: centres[0].id, departureCity: 'Douala', arrivalCity: 'Yaoundé', distanceKm: 240, estimatedDurationMinutes: 270 },
    { agencyId: agencies[3].id, centreId: centres[3].id, departureCity: 'Yaoundé', arrivalCity: 'Douala', distanceKm: 240, estimatedDurationMinutes: 270 },
  ];
  const routes = await routeRepo.save(routeRepo.create(routeData));
  console.log(`[SEED] ${routes.length} routes created`);

  // ========================================================================
  // TRIPS (Past & Future for Stats)
  // ========================================================================
  const tripData: any[] = [];
  for (let i = -10; i < 10; i++) {
    const departure = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const agencyIndex = i % 2 === 0 ? 0 : 3;
    const centreIndex = i % 2 === 0 ? 0 : 3;
    tripData.push({
      agencyId: agencies[agencyIndex].id,
      centreId: centres[centreIndex].id,
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

  // ========================================================================
  // RESERVATIONS (Revenue Data)
  // ========================================================================
  const resData: any[] = [];
  for (const trip of savedTrips) {
    const resCount = Math.floor(Math.random() * 10) + 5;
    for (let j = 0; j < resCount; j++) {
      resData.push({
        reservationCode: `R-${trip.id.substring(0, 4)}-${j}-${Math.random().toString(36).substring(7)}`,
        tripId: trip.id,
        clientId: (j % 2 === 0 ? client1 : client2).id,
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

  // ========================================================================
  // FINAL SUMMARY
  // ========================================================================
  console.log('\n═══════════════════════════════════════');
  console.log('  [SEED] ✅ SEED COMPLETED SUCCESSFULLY');
  console.log('═══════════════════════════════════════');
  console.log(`  Agencies:    ${agencies.length}`);
  console.log(`  Users:       ${users.length}`);
  console.log(`  Companies:   ${companies.length}`);
  console.log(`  Centres:     ${centres.length}`);
  console.log(`  Subscriptions: ${subscriptions.length}`);
  console.log(`  Invoices:    ${invoices.length}`);
  console.log(`  Complaints:  ${complaints.length}`);
  console.log(`  Buses:       ${buses.length}`);
  console.log(`  Routes:      ${routes.length}`);
  console.log(`  Trips:       ${savedTrips.length}`);
  console.log(`  Reservations: ${resData.length}`);
  console.log('═══════════════════════════════════════\n');

  // Login credentials
  console.log('🔑 LOGIN CREDENTIALS (password: 123456)');
  console.log('  Admin:           admin@opep.cm');
  console.log('  Company Director: paul.biya@opep-express.cm');
  console.log('  Company Director: esther.njike@star-co.cm');
  console.log('  Centre Manager:   jean.mballa@opep-express.cm');
  console.log('  Client:           adrian@email.com');
  console.log('  Client:           samuel@email.com\n');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('[SEED] ❌ Seed failed:', err.stack);
  process.exit(1);
});
