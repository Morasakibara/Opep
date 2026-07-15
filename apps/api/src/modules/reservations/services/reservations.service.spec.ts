import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationStatus } from '../entities/reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { AuditService } from '../../audit/services/audit.service';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';
import { NotificationService } from '../../notifications/notification.service';

const mockRedis = {
  set: jest.fn(),
  del: jest.fn(),
};

const mockReservationsQueue = {
  add: jest.fn(),
};

const mockFakeQueryRunner: any = {
  connect: jest.fn().mockResolvedValue(undefined),
  startTransaction: jest.fn().mockResolvedValue(undefined),
  commitTransaction: jest.fn().mockResolvedValue(undefined),
  rollbackTransaction: jest.fn().mockResolvedValue(undefined),
  release: jest.fn().mockResolvedValue(undefined),
  manager: {
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  },
};

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockTrip = {
    id: 't-1',
    agencyId: 'ag-1',
    basePrice: 5000,
    bus: { id: 'b-1', capacity: 30 },
  };

  const mockPassenger = {
    firstName: 'Fatou',
    lastName: 'Diop',
    seatNumber: '5',
    idCardNumber: '123456789',
  };

  const mockRepository = () => ({
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn().mockImplementation((data) => ({ id: 'res-1', ...data })),
  });

  const mockDataSource = () => ({
    createQueryRunner: jest.fn().mockReturnValue(mockFakeQueryRunner),
  });

  const mockAuditService = () => ({
    log: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(Reservation), useFactory: mockRepository },
        { provide: getRepositoryToken(Passenger), useFactory: mockRepository },
        { provide: getRepositoryToken(Trip), useFactory: mockRepository },
        { provide: 'BullQueue_reservations-queue', useValue: mockReservationsQueue },
        { provide: REDIS_CLIENT, useValue: mockRedis },
        { provide: DataSource, useFactory: mockDataSource },
        { provide: AuditService, useFactory: mockAuditService },
        { provide: NotificationService, useValue: { send: jest.fn().mockResolvedValue(undefined) } },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  describe('create', () => {
    it('creates a reservation successfully', async () => {
      const tripRepo = (service as any).tripRepository;
      tripRepo.findOne.mockResolvedValue(mockTrip);

      const reservationRepo = (service as any).reservationRepository;
      reservationRepo.create.mockReturnValue({ id: 'res-1', clientId: 'client-1', totalAmount: 10000 });

      const passengerRepo = (service as any).passengerRepository;
      passengerRepo.findOne.mockResolvedValue(null);

      mockRedis.set.mockResolvedValue('OK');

      const result = await service.create('client-1', 'CLIENT', {
        tripId: 't-1',
        passengers: [mockPassenger],
        type: 'REGULAR' as any,
      });

      expect(result).toBeDefined();
      expect(mockReservationsQueue.add).toHaveBeenCalled();
    });

    it('throws NotFoundException when trip does not exist', async () => {
      const tripRepo = (service as any).tripRepository;
      tripRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create('client-1', 'CLIENT', {
          tripId: 'ghost',
          passengers: [mockPassenger],
          type: 'REGULAR' as any,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when seat is already locked in Redis', async () => {
      const tripRepo = (service as any).tripRepository;
      tripRepo.findOne.mockResolvedValue(mockTrip);

      mockRedis.set.mockResolvedValue(null); // Lock failed

      await expect(
        service.create('client-1', 'CLIENT', {
          tripId: 't-1',
          passengers: [mockPassenger],
          type: 'REGULAR' as any,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByClient', () => {
    it('returns paginated reservations for a client', async () => {
      const reservationRepo = (service as any).reservationRepository;
      reservationRepo.findAndCount.mockResolvedValue([[{ id: 'res-1' }], 1]);

      const paginationDto = new PaginationDto();
      const result = await service.findByClient('client-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findByAgency', () => {
    it('returns paginated reservations for an agency', async () => {
      const reservationRepo = (service as any).reservationRepository;
      reservationRepo.findAndCount.mockResolvedValue([[{ id: 'res-1' }], 1]);

      const paginationDto = new PaginationDto();
      const result = await service.findByAgency('ag-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns a reservation when found', async () => {
      const reservationRepo = (service as any).reservationRepository;
      reservationRepo.findOne.mockResolvedValue({ id: 'res-1', trip: {}, agency: {} });

      const result = await service.findOne('res-1');
      expect(result.id).toBe('res-1');
    });

    it('throws NotFoundException when reservation is missing', async () => {
      const reservationRepo = (service as any).reservationRepository;
      reservationRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
