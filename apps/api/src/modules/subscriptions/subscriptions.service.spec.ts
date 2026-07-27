import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscriptions.entity';
import { Company } from '../companies/entities/company.entity';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  const mockSubscription = {
    id: 'sub-1',
    planName: 'Premium Plan',
    price: 75000,
    status: 'ACTIVE',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  const mockCompany = { id: 'c-1', name: 'Finexs Voyages' };

  const mockSubRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockCompanyRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: getRepositoryToken(Subscription), useValue: mockSubRepo },
        { provide: getRepositoryToken(Company), useValue: mockCompanyRepo },
      ],
    }).compile();
    service = module.get(SubscriptionsService);
  });

  describe('getPackages', () => {
    it('returns available subscription plans', async () => {
      const packages = await service.getPackages();
      expect(packages).toHaveLength(3);
      expect(packages[0].id).toBe('starter');
      expect(packages[1].id).toBe('premium');
      expect(packages[2].id).toBe('enterprise');
    });
  });

  describe('subscribe', () => {
    it('creates a subscription for a valid company and plan', async () => {
      mockCompanyRepo.findOneBy.mockResolvedValue(mockCompany);
      mockSubRepo.create.mockReturnValue(mockSubscription);
      mockSubRepo.save.mockResolvedValue(mockSubscription);

      const result = await service.subscribe('c-1', 'premium');
      expect(result.planName).toBe('Premium Plan');
      expect(result.price).toBe(75000);
    });

    it('throws NotFoundException for invalid plan', async () => {
      await expect(service.subscribe('c-1', 'invalid-plan')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for invalid company', async () => {
      mockCompanyRepo.findOneBy.mockResolvedValue(null);
      await expect(service.subscribe('c-1', 'premium')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatus', () => {
    it('returns subscriptions for a company', async () => {
      mockSubRepo.find.mockResolvedValue([mockSubscription]);
      const result = await service.getStatus('c-1');
      expect(result).toHaveLength(1);
      expect(result[0].planName).toBe('Premium Plan');
    });
  });
});
