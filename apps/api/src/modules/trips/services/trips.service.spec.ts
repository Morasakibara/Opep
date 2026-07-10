import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripsService } from './trips.service';
import { Trip, TripStatus } from '../entities/trip.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('TripsService', () => {
  let service: TripsService;
  let repo: Repository<Trip>;

  const mockTrip = {
    id: 't-1',
    agencyId: 'ag-1',
    routeId: 'r-1',
    busId: 'b-1',
    basePrice: 5000,
    status: TripStatus.SCHEDULED,
    departureDateTime: new Date('2026-07-15T08:00:00Z'),
    arrivalDateTime: new Date('2026-07-15T12:00:00Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      orderBy: jest.fn().mockReturnThis(),
    })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: getRepositoryToken(Trip), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<TripsService>(TripsService);
    repo = module.get(getRepositoryToken(Trip));
  });

  describe('create', () => {
    it('creates a trip with converted dates', async () => {
      mockRepository.create.mockReturnValue(mockTrip);
      mockRepository.save.mockResolvedValue(mockTrip);

      const result = await service.create('ag-1', {
        routeId: 'r-1',
        busId: 'b-1',
        basePrice: 5000,
        departureDateTime: '2026-07-15T08:00:00Z',
        arrivalDateTime: '2026-07-15T12:00:00Z',
      });

      expect(result.id).toBe('t-1');
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ agencyId: 'ag-1' }),
      );
    });
  });

  describe('search', () => {
    it('returns paginated search results', async () => {
      const qb = mockRepository.createQueryBuilder();
      qb.getManyAndCount.mockResolvedValue([[mockTrip], 1]);

      const paginationDto = new PaginationDto();
      const result = await service.search(
        { departureCity: 'Dakar', arrivalCity: 'Thies' },
        paginationDto,
      );

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findAll', () => {
    it('returns paginated trips for an agency', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTrip], 1]);
      const paginationDto = new PaginationDto();

      const result = await service.findAll('ag-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns a trip when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockTrip);
      const result = await service.findOne('ag-1', 't-1');
      expect(result.id).toBe('t-1');
    });

    it('throws NotFoundException when trip is missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('ag-1', 'unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAvailable', () => {
    it('returns paginated scheduled trips', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTrip], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAvailable(paginationDto);
      expect(result.items).toHaveLength(1);
    });
  });

  describe('remove', () => {
    it('cancels the trip instead of deleting', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockTrip, status: TripStatus.SCHEDULED });
      mockRepository.save.mockResolvedValue({ ...mockTrip, status: TripStatus.CANCELLED });

      await service.remove('ag-1', 't-1');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: TripStatus.CANCELLED }),
      );
    });
  });
});
