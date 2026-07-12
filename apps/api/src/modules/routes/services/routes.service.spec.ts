import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutesService } from './routes.service';
import { Route } from '../entities/route.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('RoutesService', () => {
  let service: RoutesService;

  const mockRoute = {
    id: 'r-1',
    agencyId: 'ag-1',
    departureCity: 'Dakar',
    arrivalCity: 'Thies',
    distanceKm: 75,
    estimatedDurationMinutes: 90,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        RoutesService,
        { provide: getRepositoryToken(Route), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<RoutesService>(RoutesService);
  });

  describe('create', () => {
    it('creates a route for the given agency', async () => {
      mockRepository.create.mockReturnValue(mockRoute);
      mockRepository.save.mockResolvedValue(mockRoute);

      const result = await service.create('ag-1', undefined, {
        departureCity: 'Dakar',
        arrivalCity: 'Thies',
        distanceKm: 75,
        estimatedDurationMinutes: 90,
      });

      expect(result.id).toBe('r-1');
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ agencyId: 'ag-1' }),
      );
    });
  });

  describe('findAll', () => {
    it('returns paginated active routes for the agency', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockRoute], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAll('ag-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns a route when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockRoute);
      const result = await service.findOne('ag-1', 'r-1');
      expect(result.id).toBe('r-1');
    });

    it('throws NotFoundException when route is missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('ag-1', 'unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('soft-deletes by setting isActive to false', async () => {
      mockRepository.findOne.mockResolvedValue(mockRoute);
      mockRepository.save.mockResolvedValue({ ...mockRoute, isActive: false });
      await service.remove('ag-1', 'r-1');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
