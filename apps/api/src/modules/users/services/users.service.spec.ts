import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserRole } from '@opep/shared-types';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 'u-1',
    firstName: 'Awa',
    lastName: 'Ndiaye',
    phone: '670000001',
    email: 'awa@opep.test',
    passwordHash: 'hashed-password',
    role: 'CLIENT',
    agencyId: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('creates a user when phone/email are unique', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create({
        firstName: 'Awa',
        lastName: 'Ndiaye',
        phone: '670000001',
        email: 'awa@opep.test',
        password: 'secret123',
        role: UserRole.CLIENT,
      });

      expect(result.id).toBe('u-1');
      expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('throws ConflictException when phone already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      await expect(
        service.create({
          firstName: 'Awa',
          lastName: 'Ndiaye',
          phone: '670000001',
          password: 'secret123',
          role: UserRole.CLIENT,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByIdentifier', () => {
    it('finds user by email or phone', async () => {
      mockRepository.createQueryBuilder().getOne.mockResolvedValue(mockUser);
      const result = await service.findByIdentifier('awa@opep.test');
      expect(result?.id).toBe('u-1');
    });

    it('appends passwordHash via addSelect', async () => {
      const qb = mockRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockUser);
      await service.findByIdentifier('awa@opep.test');
      expect(qb.addSelect).toHaveBeenCalledWith('user.passwordHash');
    });
  });

  describe('findAll', () => {
    it('returns paginated users', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAll(paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('update', () => {
    it('updates user fields and returns updated user', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.update('u-1', { firstName: 'NewName' });
      expect(mockRepository.update).toHaveBeenCalledWith('u-1', { firstName: 'NewName' });
      expect(result.firstName).toBe('Awa');
    });
  });

  describe('remove', () => {
    it('deletes the user by id', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('u-1');
      expect(mockRepository.delete).toHaveBeenCalledWith('u-1');
    });
  });
});
