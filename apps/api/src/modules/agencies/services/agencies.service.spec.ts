import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgenciesService } from './agencies.service';
import { Agency } from '../entities/agency.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('AgenciesService', () => {
  let service: AgenciesService;
  let repo: Repository<Agency>;

  const mockAgency = {
    id: 'ag-1',
    name: 'OPEP Transport',
    subscriptionPlan: 'BASIC',
    phone: '771234567',
    email: 'contact@opep.sn',
    address: 'Dakar',
    city: 'Dakar',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AgenciesService,
        { provide: getRepositoryToken(Agency), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<AgenciesService>(AgenciesService);
    repo = module.get(getRepositoryToken(Agency));
  });

  describe('create', () => {
    it('creates an agency when name is unique', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockAgency);
      mockRepository.save.mockResolvedValue(mockAgency);

      const result = await service.create({
        name: 'OPEP Transport',
        phone: '771234567',
        city: 'Dakar',
        address: '123 Rue Principale',
        email: 'contact@opep.sn',
      });

      expect(result.id).toBe('ag-1');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('throws ConflictException when name already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockAgency);
      await expect(
        service.create({ name: 'OPEP Transport', phone: '771234567', city: 'Dakar', address: 'Addr', email: 'a@b.com' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('returns only active agencies paginated', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAgency], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAll(paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns an agency when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockAgency);
      const result = await service.findOne('ag-1');
      expect(result.id).toBe('ag-1');
    });

    it('throws NotFoundException when agency is missing', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates agency and returns the updated entity', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(mockAgency);

      const result = await service.update('ag-1', { name: 'New Name' });
      expect(mockRepository.update).toHaveBeenCalledWith('ag-1', { name: 'New Name' });
      expect(result.name).toBe('OPEP Transport');
    });
  });

  describe('remove', () => {
    it('soft-deletes by setting isActive to false', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      await service.remove('ag-1');
      expect(mockRepository.update).toHaveBeenCalledWith('ag-1', { isActive: false });
    });
  });
});
