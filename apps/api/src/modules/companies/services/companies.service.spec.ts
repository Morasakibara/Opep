import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesService } from './companies.service';
import { Company } from '../entities/company.entity';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '@opep/shared-types';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyRepo: Repository<Company>;
  let userRepo: Repository<User>;

  const mockCompany = {
    id: 'comp-1',
    name: 'OPEP Express',
    directorUserId: null,
    address: '123 Rue Principale',
    city: 'Douala',
    phone: '691234567',
    email: 'contact@opep.cm',
    logoUrl: null,
    isActive: true,
    publicRatingAverage: null,
    reviewsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Company;

  const mockDirector = {
    id: 'user-1',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: UserRole.COMPANY_DIRECTOR,
  } as User;

  const mockCompanyRepo = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: getRepositoryToken(Company), useValue: mockCompanyRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();
    service = module.get<CompaniesService>(CompaniesService);
    companyRepo = module.get(getRepositoryToken(Company));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('creates a company when name is unique', async () => {
      mockCompanyRepo.findOne
        .mockResolvedValueOnce(null)     // 1er appel: vérification unicité → pas de doublon
        .mockResolvedValueOnce(mockCompany); // 2e appel: retour après save
      mockCompanyRepo.create.mockReturnValue(mockCompany);
      mockCompanyRepo.save.mockResolvedValue(mockCompany);

      const result = await service.create({
        name: 'OPEP Express',
        phone: '691234567',
        city: 'Douala',
        address: '123 Rue Principale',
        email: 'contact@opep.cm',
      });

      expect(result.id).toBe('comp-1');
      expect(mockCompanyRepo.save).toHaveBeenCalled();
    });

    it('throws ConflictException when name already exists', async () => {
      mockCompanyRepo.findOne.mockResolvedValue(mockCompany);
      await expect(
        service.create({
          name: 'OPEP Express',
          phone: '691234567',
          city: 'Douala',
          address: 'Addr',
          email: 'a@b.com',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('assignDirector', () => {
    it('assigns a COMPANY_DIRECTOR to a company', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockDirector);
      mockCompanyRepo.findOne.mockResolvedValue(null);
      mockCompanyRepo.update.mockResolvedValue({ affected: 1 } as any);

      await service.assignDirector('comp-1', 'user-1');
      expect(mockCompanyRepo.update).toHaveBeenCalledWith('comp-1', { directorUserId: 'user-1' });
    });

    it('throws NotFoundException when user does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.assignDirector('comp-1', 'unknown')).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when user is not COMPANY_DIRECTOR', async () => {
      mockUserRepo.findOne.mockResolvedValue({ ...mockDirector, role: UserRole.CLIENT });
      await expect(service.assignDirector('comp-1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('returns paginated companies with director relation', async () => {
      mockCompanyRepo.findAndCount.mockResolvedValue([[mockCompany], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAll(paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns a company when found', async () => {
      mockCompanyRepo.findOne.mockResolvedValue(mockCompany);
      const result = await service.findOne('comp-1');
      expect(result.id).toBe('comp-1');
    });

    it('throws NotFoundException when company is missing', async () => {
      mockCompanyRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates and returns the company', async () => {
      mockCompanyRepo.update.mockResolvedValue({ affected: 1 } as any);
      mockCompanyRepo.findOne.mockResolvedValue(mockCompany);

      const result = await service.update('comp-1', { name: 'New Name' });
      expect(mockCompanyRepo.update).toHaveBeenCalledWith('comp-1', { name: 'New Name' });
      expect(result.name).toBe('OPEP Express');
    });
  });

  describe('remove', () => {
    it('soft-deletes by setting isActive to false', async () => {
      mockCompanyRepo.update.mockResolvedValue({ affected: 1 } as any);
      await service.remove('comp-1');
      expect(mockCompanyRepo.update).toHaveBeenCalledWith('comp-1', { isActive: false });
    });
  });
});
