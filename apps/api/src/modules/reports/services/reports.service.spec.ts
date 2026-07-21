import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { Payment, PaymentStatus } from '../../payments/entities/payment.entity';
import { Trip, TripStatus } from '../../trips/entities/trip.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { Centre } from '../../centres/entities/centre.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let paymentRepo: any;
  let reservationRepo: any;
  let centreRepo: any;

  const mockRepository = () => ({
    count: jest.fn().mockResolvedValue(0),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '50000' }),
      getRawMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    })),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Reservation), useFactory: mockRepository },
        { provide: getRepositoryToken(Payment), useFactory: mockRepository },
        { provide: getRepositoryToken(Trip), useFactory: mockRepository },
        { provide: getRepositoryToken(Ticket), useFactory: mockRepository },
        { provide: getRepositoryToken(User), useFactory: mockRepository },
        { provide: getRepositoryToken(Company), useFactory: mockRepository },
        { provide: getRepositoryToken(Centre), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    paymentRepo = module.get(getRepositoryToken(Payment));
    reservationRepo = module.get(getRepositoryToken(Reservation));
    centreRepo = module.get(getRepositoryToken(Centre));
  });

  describe('getDashboardStats', () => {
    it('should return aggregated dashboard statistics without scope', async () => {
      const result = await service.getDashboardStats();
      expect(result).toHaveProperty('totalReservations');
      expect(result).toHaveProperty('totalRevenue');
      expect(result).toHaveProperty('activeTrips');
      expect(result).toHaveProperty('totalCompanies');
      expect(result).toHaveProperty('revenueFormatted');
    });

    it('should filter by centreId when scope.centreId is provided', async () => {
      reservationRepo.count.mockResolvedValue(5);
      const result = await service.getDashboardStats({ centreId: 'centre-123' });
      expect(result.totalReservations).toBe(5);
      // Vérifie que le count a été appelé avec le filtre centreId
      const countCall = reservationRepo.count.mock.calls[0][0];
      expect(countCall.where.centreId).toBe('centre-123');
    });

    it('should filter by agencyId when scope.agencyId is provided (legacy)', async () => {
      reservationRepo.count.mockResolvedValue(3);
      const result = await service.getDashboardStats({ agencyId: 'agency-456' });
      expect(result.totalReservations).toBe(3);
      const countCall = reservationRepo.count.mock.calls[0][0];
      expect(countCall.where.agencyId).toBe('agency-456');
    });

    it('should filter by companyId via centres lookup', async () => {
      const mockCentres = [{ id: 'centre-a' }, { id: 'centre-b' }];
      centreRepo.find.mockResolvedValue(mockCentres);
      reservationRepo.count.mockResolvedValue(8);

      const result = await service.getDashboardStats({ companyId: 'company-789' });
      expect(result.totalReservations).toBe(8);

      // Vérifie que centreRepo.find a cherché les centres de la compagnie
      expect(centreRepo.find).toHaveBeenCalledWith({
        where: { companyId: 'company-789', isActive: true },
        select: ['id'],
      });

      // Vérifie que le filtre utilise les centreIds trouvés
      const countCall = reservationRepo.count.mock.calls[0][0];
      expect(countCall.where.centreId).toEqual(['centre-a', 'centre-b']);
    });

    it('should return 0 reservations when company has no active centres', async () => {
      centreRepo.find.mockResolvedValue([]);
      reservationRepo.count.mockResolvedValue(0);

      const result = await service.getDashboardStats({ companyId: 'company-empty' });
      expect(result.totalReservations).toBe(0);

      // Vérifie que le filtre évite le IN vide avec un UUID impossible
      const countCall = reservationRepo.count.mock.calls[0][0];
      expect(countCall.where.centreId).toBeTruthy();
      // Ne doit pas être un tableau vide
      expect(Array.isArray(countCall.where.centreId)).toBe(false);
    });

    it('should return totalCompanies count', async () => {
      const result = await service.getDashboardStats();
      expect(result).toHaveProperty('totalCompanies');
      expect(typeof result.totalCompanies).toBe('number');
    });
  });

  describe('getRevenueData', () => {
    it('should return monthly revenue data for 6 months', async () => {
      paymentRepo.createQueryBuilder().getRawMany.mockResolvedValue([]);
      const result = await service.getRevenueData('6months');
      expect(result).toHaveLength(6);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('value');
    });

    it('should return 12 months when period is 12months', async () => {
      paymentRepo.createQueryBuilder().getRawMany.mockResolvedValue([]);
      const result = await service.getRevenueData('12months');
      expect(result).toHaveLength(12);
    });
  });

  describe('getHealthStatus', () => {
    it('should return healthy status with metrics', async () => {
      const result = await service.getHealthStatus();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
