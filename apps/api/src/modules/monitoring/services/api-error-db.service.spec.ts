import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ApiError } from '../entities/api-error.entity';
import { ApiErrorDbService } from './api-error-db.service';

describe('ApiErrorDbService', () => {
  let service: ApiErrorDbService;
  let repository: jest.Mocked<Repository<ApiError>>;

  const mockError: ApiError = {
    id: 'err-1',
    method: 'GET',
    url: '/api/v1/test',
    statusCode: 500,
    message: 'Internal server error',
    stack: 'Error: test\n    at Object.<anonymous> (test.ts:1:1)',
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
    hasId: () => true,
    save: () => Promise.resolve({} as any),
    remove: () => Promise.resolve({} as any),
    softRemove: () => Promise.resolve({} as any),
    recover: () => Promise.resolve({} as any),
    reload: () => Promise.resolve({} as any),
  };

  function mockQueryBuilder(overrides: Partial<SelectQueryBuilder<ApiError>> = {}): any {
    return {
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockError]),
      getRawMany: jest.fn().mockResolvedValue([]),
      ...overrides,
    };
  }

  beforeEach(async () => {
    repository = {
      save: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      clear: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        ApiErrorDbService,
        { provide: getRepositoryToken(ApiError), useValue: repository },
      ],
    }).compile();

    service = module.get<ApiErrorDbService>(ApiErrorDbService);
  });

  describe('create()', () => {
    it('persists an error and returns it', async () => {
      repository.save!.mockResolvedValue(mockError as any);

      const result = await service.create({
        method: 'GET',
        url: '/api/v1/test',
        statusCode: 500,
        message: 'Internal server error',
        stack: 'Error: test\n    at Object.<anonymous> (test.ts:1:1)',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      });

      expect(repository.save).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/v1/test',
        statusCode: 500,
        message: 'Internal server error',
        stack: 'Error: test\n    at Object.<anonymous> (test.ts:1:1)',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      });
      expect(result).toEqual(mockError);
    });

    it('works without optional fields', async () => {
      repository.save!.mockResolvedValue({ ...mockError, statusCode: 400, stack: null, ipAddress: null, userAgent: null } as any);

      const result = await service.create({
        method: 'POST',
        url: '/api/v1/users',
        statusCode: 400,
        message: 'Bad request',
      });

      expect(repository.save).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/v1/users',
        statusCode: 400,
        message: 'Bad request',
        stack: undefined,
        ipAddress: undefined,
        userAgent: undefined,
      });
      expect(result.statusCode).toBe(400);
    });

    it('throws if repository.save fails', async () => {
      repository.save!.mockRejectedValue(new Error('DB connection lost'));

      await expect(
        service.create({
          method: 'GET',
          url: '/api/v1/test',
          statusCode: 500,
          message: 'error',
        }),
      ).rejects.toThrow('DB connection lost');
    });
  });

  describe('findRecent()', () => {
    it('returns paginated errors without cursor', async () => {
      const qb = mockQueryBuilder();
      repository.count!.mockResolvedValue(1);
      repository.createQueryBuilder!.mockReturnValue(qb);

      const result = await service.findRecent(20);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.nextCursor).toBeUndefined();
      expect(qb.orderBy).toHaveBeenCalledWith('e.createdAt', 'DESC');
    });

    it('handles cursor-based pagination', async () => {
      const qb = mockQueryBuilder();
      repository.count!.mockResolvedValue(2);
      repository.createQueryBuilder!.mockReturnValue(qb);

      const result = await service.findRecent(20, '2024-01-01T00:00:00.000Z');

      expect(qb.where).toHaveBeenCalledWith('e.createdAt < :cursor', {
        cursor: '2024-01-01T00:00:00.000Z',
      });
      expect(result.total).toBe(2);
    });

    it('returns nextCursor when there are more results than limit', async () => {
      const errors = Array.from({ length: 21 }, (_, i) => ({
        ...mockError,
        id: `err-${i}`,
        createdAt: new Date(2024, 0, 1, 0, 0, i),
      }));

      const qb = mockQueryBuilder({ getMany: jest.fn().mockResolvedValue(errors) });
      repository.count!.mockResolvedValue(30);
      repository.createQueryBuilder!.mockReturnValue(qb);

      const result = await service.findRecent(20);

      expect(result.data).toHaveLength(20);
      expect(result.nextCursor).toBeDefined();
    });
  });

  describe('getStats()', () => {
    it('returns stats grouped by status code', async () => {
      const qb = mockQueryBuilder({
        getRawMany: jest.fn().mockResolvedValue([
          { statusCode: 500, count: '10' },
          { statusCode: 401, count: '5' },
          { statusCode: 404, count: '3' },
        ]),
      });
      repository.createQueryBuilder!.mockReturnValue(qb);

      const stats = await service.getStats();

      expect(stats.total).toBe(18);
      expect(stats.byStatus['500']).toBe(10);
      expect(stats.byStatus['401']).toBe(5);
      expect(stats.byStatus['404']).toBe(3);
    });

    it('returns 0 total for empty database', async () => {
      const qb = mockQueryBuilder({ getRawMany: jest.fn().mockResolvedValue([]) });
      repository.createQueryBuilder!.mockReturnValue(qb);

      const stats = await service.getStats();
      expect(stats.total).toBe(0);
      expect(stats.byStatus).toEqual({});
    });
  });

  describe('clear()', () => {
    it('clears all errors from the database', async () => {
      repository.clear!.mockResolvedValue(undefined);

      await service.clear();

      expect(repository.clear).toHaveBeenCalled();
    });
  });
});
