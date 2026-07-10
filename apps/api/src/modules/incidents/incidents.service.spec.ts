import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incidents.entity';
import { IncidentsService } from './incidents.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let repo: Repository<Incident>;

  const mockIncident = {
    id: 'inc-1',
    type: 'MECHANICAL_BREAKDOWN',
    description: 'Panne moteur sur la N3',
    status: 'PENDING',
    refundTriggered: false,
    refundAmount: null,
    reportedBy: null,
    trip: null,
    createdAt: new Date(),
  } as Incident;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
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
    repo = module.get(getRepositoryToken(Incident));
  });

  describe('create', () => {
    it('creates and saves a new incident', async () => {
      const data = { type: 'ACCIDENT', description: 'Collision' };
      mockRepository.create.mockReturnValue(mockIncident);
      mockRepository.save.mockResolvedValue(mockIncident);

      const result = await service.create(data);

      expect(mockRepository.create).toHaveBeenCalledWith(data);
      expect(mockRepository.save).toHaveBeenCalledWith(mockIncident);
      expect(result.id).toBe('inc-1');
      expect(result.type).toBe('MECHANICAL_BREAKDOWN');
    });

    it('handles save returning an array by returning first element', async () => {
      const data = { type: 'DELAY', description: 'Retard de 2h' };
      mockRepository.create.mockReturnValue(mockIncident);
      // TypeORM save() can return T | T[], so test the array path
      mockRepository.save.mockResolvedValue([mockIncident]);

      const result = await service.create(data);

      expect(result.id).toBe('inc-1');
    });
  });

  describe('findAll', () => {
    it('returns paginated incidents with relations', async () => {
      const incidents = [mockIncident];
      mockRepository.findAndCount.mockResolvedValue([incidents, 1]);

      const paginationDto = new PaginationDto();
      const result = await service.findAll(paginationDto);

      expect(result.items).toEqual(incidents);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns an incident when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockIncident);

      const result = await service.findOne('inc-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'inc-1' },
        relations: ['reportedBy', 'trip'],
      });
      expect(result.id).toBe('inc-1');
    });

    it('throws NotFoundException when incident is missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('resolve', () => {
    it('marks incident as resolved', async () => {
      const pendingIncident = { ...mockIncident, status: 'PENDING' };
      mockRepository.findOne.mockResolvedValue(pendingIncident);

      const resolvedIncident = { ...pendingIncident, status: 'RESOLVED' };
      mockRepository.save.mockResolvedValue(resolvedIncident);

      const result = await service.resolve('inc-1');

      expect(result.status).toBe('RESOLVED');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('sets refund amount when provided', async () => {
      const pendingIncident = { ...mockIncident, status: 'PENDING' };
      mockRepository.findOne.mockResolvedValue(pendingIncident);

      const resolvedIncident = {
        ...pendingIncident,
        status: 'RESOLVED',
        refundTriggered: true,
        refundAmount: 5000,
      };
      mockRepository.save.mockResolvedValue(resolvedIncident);

      const result = await service.resolve('inc-1', 5000);

      expect(result.status).toBe('RESOLVED');
      expect(result.refundTriggered).toBe(true);
      expect(result.refundAmount).toBe(5000);
    });

    it('handles save returning array during resolve', async () => {
      const pendingIncident = { ...mockIncident, status: 'PENDING' };
      mockRepository.findOne.mockResolvedValue(pendingIncident);

      const resolvedIncident = { ...pendingIncident, status: 'RESOLVED' };
      mockRepository.save.mockResolvedValue([resolvedIncident]);

      const result = await service.resolve('inc-1');

      expect(result.status).toBe('RESOLVED');
    });
  });
});
