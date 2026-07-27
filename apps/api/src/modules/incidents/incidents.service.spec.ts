import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IncidentsService } from './incidents.service';
import { Incident } from './incidents.entity';

describe('IncidentsService', () => {
  let service: IncidentsService;

  const mockIncident = {
    id: 'inc-1',
    title: 'Retard important',
    status: 'OPEN',
    reportedBy: { id: 'u-1' },
    trip: { id: 't-1' },
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: getRepositoryToken(Incident), useValue: mockRepository },
      ],
    }).compile();
    service = module.get(IncidentsService);
  });

  describe('create', () => {
    it('creates and returns an incident', async () => {
      const dto = { title: 'Test', description: 'Desc' };
      mockRepository.create.mockReturnValue(mockIncident);
      mockRepository.save.mockResolvedValue(mockIncident);

      const result = await service.create(dto as any);
      expect(result.id).toBe('inc-1');
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('returns paginated incidents', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockIncident], 1]);
      const result = await service.findAll({ page: 1, limit: 20, sortOrder: 'DESC' });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns incident when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockIncident);
      const result = await service.findOne('inc-1');
      expect(result.id).toBe('inc-1');
    });

    it('throws NotFoundException when missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('ghost')).rejects.toThrow(NotFoundException);
    });
  });

  describe('resolve', () => {
    it('marks incident as RESOLVED', async () => {
      const incident = { ...mockIncident, status: 'OPEN' };
      mockRepository.findOne.mockResolvedValue(incident);
      mockRepository.save.mockImplementation((d) => Promise.resolve({ ...d, status: 'RESOLVED' }));

      const result = await service.resolve('inc-1');
      expect(result.status).toBe('RESOLVED');
    });

    it('sets refund fields when amount provided', async () => {
      const incident = { ...mockIncident, status: 'OPEN' };
      mockRepository.findOne.mockResolvedValue(incident);
      mockRepository.save.mockImplementation((d) => Promise.resolve({ ...d, status: 'RESOLVED' }));

      const result = await service.resolve('inc-1', 5000);
      expect(result.status).toBe('RESOLVED');
      expect(result.refundTriggered).toBe(true);
    });
  });
});
