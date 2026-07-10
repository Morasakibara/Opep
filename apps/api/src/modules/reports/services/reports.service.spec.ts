import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { Payment, PaymentStatus } from '../../payments/entities/payment.entity';
import { Trip, TripStatus } from '../../trips/entities/trip.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';
import { Agency } from '../../agencies/entities/agency.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let paymentRepo: any;

  const mockRepository = () => ({
    count: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
      getRawMany: jest.fn(),
      getCount: jest.fn(),
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
        { provide: getRepositoryToken(Agency), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    paymentRepo = module.get(getRepositoryToken(Payment));
  });

  describe('getDashboardStats', () => {
    it('should return aggregated dashboard statistics', async () => {
      const result = await service.getDashboardStats();
      expect(result).toHaveProperty('totalReservations');
      expect(result).toHaveProperty('totalRevenue');
      expect(result).toHaveProperty('activeTrips');
      expect(result).toHaveProperty('revenueFormatted');
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
