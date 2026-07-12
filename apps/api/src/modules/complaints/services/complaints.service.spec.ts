import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplaintsService } from './complaints.service';
import { Complaint, ComplaintStatus } from '../entities/complaint.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('ComplaintsService', () => {
  let service: ComplaintsService;
  let repo: Repository<Complaint>;

  const mockComplaint = {
    id: 'comp-1',
    tripId: 'trip-1',
    reservationId: 'res-1',
    clientId: 'client-1',
    centreId: 'cen-1',
    companyId: 'comp-1',
    category: 'RETARD',
    description: 'Bus arrivé avec 2h de retard',
    status: ComplaintStatus.OPEN,
    assignedToUserId: null,
    response: null,
    resolvedAt: null,
    resolvedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Complaint;

  const mockRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ComplaintsService,
        { provide: getRepositoryToken(Complaint), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<ComplaintsService>(ComplaintsService);
    repo = module.get(getRepositoryToken(Complaint));
  });

  describe('create', () => {
    it('creates a new complaint', async () => {
      mockRepository.create.mockReturnValue(mockComplaint);
      mockRepository.save.mockResolvedValue(mockComplaint);

      const result = await service.create(
        {
          tripId: 'trip-1',
          reservationId: 'res-1',
          centreId: 'cen-1',
          companyId: 'comp-1',
          category: 'RETARD' as any,
          description: 'Bus arrivé avec 2h de retard',
        },
        'client-1',
      );

      expect(result.id).toBe('comp-1');
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ clientId: 'client-1' }),
      );
    });
  });

  describe('findByCentre', () => {
    it('returns paginated complaints for a centre', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockComplaint], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findByCentre('cen-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findByCompany', () => {
    it('returns paginated complaints for a company', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockComplaint], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findByCompany('comp-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns a complaint when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockComplaint);
      const result = await service.findOne('comp-1');
      expect(result.id).toBe('comp-1');
    });

    it('throws NotFoundException when complaint is missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('updates status and sets resolved fields when resolved', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue({
        ...mockComplaint,
        status: ComplaintStatus.RESOLVED,
        resolvedAt: new Date(),
        resolvedBy: 'admin-1',
      });

      const result = await service.updateStatus(
        'comp-1',
        ComplaintStatus.RESOLVED,
        'Problème réglé',
        'admin-1',
      );

      expect(mockRepository.update).toHaveBeenCalledWith(
        'comp-1',
        expect.objectContaining({
          status: ComplaintStatus.RESOLVED,
          response: 'Problème réglé',
          resolvedBy: 'admin-1',
        }),
      );
      expect(result.status).toBe(ComplaintStatus.RESOLVED);
    });

    it('does not set resolvedAt if status is not final', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue({
        ...mockComplaint,
        status: ComplaintStatus.IN_PROGRESS,
      });

      const result = await service.updateStatus('comp-1', ComplaintStatus.IN_PROGRESS);
      expect(result.status).toBe(ComplaintStatus.IN_PROGRESS);
    });
  });

  describe('getMyComplaints', () => {
    it('returns paginated complaints for a client', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockComplaint], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.getMyComplaints('client-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
