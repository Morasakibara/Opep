import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentresService } from './centres.service';
import { Centre } from '../entities/centre.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('CentresService', () => {
  let service: CentresService;
  let repo: Repository<Centre>;

  const mockCentre = {
    id: 'cen-1',
    companyId: 'comp-1',
    managerUserId: null,
    name: 'Gare de Douala',
    city: 'Douala',
    address: '123 Rue du Port',
    phone: '691234567',
    email: 'douala@opep.cm',
    isActive: true,
    cancellationPenaltyPercent: null,
    maxFreeReports: null,
    minDepositPercent: null,
    publicRatingAverage: 4.5,
    reviewsCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Centre;

  const mockRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        CentresService,
        { provide: getRepositoryToken(Centre), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<CentresService>(CentresService);
    repo = module.get(getRepositoryToken(Centre));
  });

  describe('create', () => {
    it('creates and saves a new centre', async () => {
      mockRepository.create.mockReturnValue(mockCentre);
      mockRepository.save.mockResolvedValue(mockCentre);

      const result = await service.create({
        companyId: 'comp-1',
        name: 'Gare de Douala',
        city: 'Douala',
        address: '123 Rue du Port',
        phone: '691234567',
        email: 'douala@opep.cm',
      });

      expect(result.id).toBe('cen-1');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated centres with relations', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockCentre], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAll(paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('filters by companyId when provided', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockCentre], 1]);
      const paginationDto = new PaginationDto();
      await service.findAll(paginationDto, 'comp-1');
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { companyId: 'comp-1' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('returns a centre when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockCentre);
      const result = await service.findOne('cen-1');
      expect(result.id).toBe('cen-1');
    });

    it('throws NotFoundException when centre is missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates and returns the centre', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue(mockCentre);

      const result = await service.update('cen-1', { name: 'New Name' });
      expect(mockRepository.update).toHaveBeenCalledWith('cen-1', { name: 'New Name' });
      expect(result.name).toBe('Gare de Douala');
    });
  });

  describe('remove', () => {
    it('soft-deletes by setting isActive to false', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      await service.remove('cen-1');
      expect(mockRepository.update).toHaveBeenCalledWith('cen-1', { isActive: false });
    });
  });

  describe('getRanking', () => {
    it('returns top centres by rating', async () => {
      mockRepository.find.mockResolvedValue([mockCentre]);
      const result = await service.getRanking();
      expect(result).toHaveLength(1);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { publicRatingAverage: 'DESC' },
          take: 50,
        }),
      );
    });
  });
});
