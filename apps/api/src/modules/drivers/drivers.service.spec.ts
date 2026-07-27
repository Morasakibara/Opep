import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DriversService } from './drivers.service';
import { Driver } from './drivers.entity';

describe('DriversService', () => {
  let service: DriversService;

  const mockDriver = {
    id: 'd-1',
    rating: 4.5,
    totalTrips: 10,
    performanceScore: 92,
    user: { id: 'u-1', firstName: 'Jean', lastName: 'Ngom' },
    createdAt: new Date(),
  };

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        DriversService,
        { provide: getRepositoryToken(Driver), useValue: mockRepository },
      ],
    }).compile();
    service = module.get(DriversService);
  });

  describe('findAll', () => {
    it('returns paginated drivers', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockDriver], 1]);
      const result = await service.findAll({ page: 1, limit: 20, sortOrder: 'DESC' });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('d-1');
    });
  });

  describe('findOne', () => {
    it('returns a driver when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockDriver);
      const result = await service.findOne('d-1');
      expect(result.id).toBe('d-1');
      expect(result.user.firstName).toBe('Jean');
    });

    it('throws NotFoundException when missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('ghost')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPerformance', () => {
    it('returns performance stats', async () => {
      mockRepository.findOne.mockResolvedValue(mockDriver);
      const result = await service.getPerformance('d-1');
      expect(result.driverId).toBe('d-1');
      expect(result.performanceScore).toBe(92);
      expect(result.punctualityRate).toBe(95.5);
    });
  });

  describe('updateRating', () => {
    it('updates average rating correctly', async () => {
      const driver = { ...mockDriver, rating: 4.0, totalTrips: 4 };
      mockRepository.findOne.mockResolvedValue(driver);
      mockRepository.save.mockImplementation((d) => Promise.resolve(d));

      const result = await service.updateRating('d-1', 5);
      // (4*4 + 5) / (4+1) = (16+5)/5 = 4.2
      expect(result.rating).toBeCloseTo(4.2);
      expect(result.totalTrips).toBe(5);
    });
  });
});
