import { Test } from '@nestjs/testing';
import { MonitoringController } from './monitoring.controller';
import { ErrorStoreService } from '../../common/filters/error-store.service';
import { ApiErrorDbService } from './services/api-error-db.service';

describe('MonitoringController', () => {
  let controller: MonitoringController;
  let apiErrorDb: jest.Mocked<ApiErrorDbService>;
  let errorStore: jest.Mocked<ErrorStoreService>;

  const mockApiErrorDb = {
    findRecent: jest.fn(),
    getStats: jest.fn(),
    clear: jest.fn(),
  };

  const mockErrorStore = {
    push: jest.fn(),
    getRecent: jest.fn(),
    getStats: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [MonitoringController],
      providers: [
        { provide: ApiErrorDbService, useValue: mockApiErrorDb },
        { provide: ErrorStoreService, useValue: mockErrorStore },
      ],
    }).compile();
    controller = module.get(MonitoringController);
    apiErrorDb = module.get(ApiErrorDbService);
    errorStore = module.get(ErrorStoreService);
  });

  describe('GET /errors', () => {
    it('returns paginated errors without filters', async () => {
      const expected = {
        data: [],
        nextCursor: undefined,
        total: 0,
      };
      mockApiErrorDb.findRecent.mockResolvedValue(expected);

      const result = await controller.getRecentErrors('20', undefined);

      expect(apiErrorDb.findRecent).toHaveBeenCalledWith(20, undefined, undefined);
      expect(result).toEqual(expected);
    });

    it('passes cursor for pagination', async () => {
      await controller.getRecentErrors('20', '2024-01-01T00:00:00.000Z');

      expect(apiErrorDb.findRecent).toHaveBeenCalledWith(
        20,
        '2024-01-01T00:00:00.000Z',
        undefined,
      );
    });

    it('passes minStatus and maxStatus filters', async () => {
      await controller.getRecentErrors('20', undefined, '400', '499');

      expect(apiErrorDb.findRecent).toHaveBeenCalledWith(20, undefined, {
        minStatus: 400,
        maxStatus: 499,
      });
    });

    it('passes search filter', async () => {
      await controller.getRecentErrors('20', undefined, undefined, undefined, '/api/v1');

      expect(apiErrorDb.findRecent).toHaveBeenCalledWith(20, undefined, {
        search: '/api/v1',
      });
    });

    it('passes combined filters', async () => {
      await controller.getRecentErrors('50', undefined, '500', '599', '/api/v1/trips');

      expect(apiErrorDb.findRecent).toHaveBeenCalledWith(50, undefined, {
        minStatus: 500,
        maxStatus: 599,
        search: '/api/v1/trips',
      });
    });

    it('does not pass filters when no query params provided', async () => {
      await controller.getRecentErrors(undefined, undefined);

      expect(apiErrorDb.findRecent).toHaveBeenCalledWith(20, undefined, undefined);
    });

    it('uses default limit 20 when limit is not provided', async () => {
      await controller.getRecentErrors();

      expect(apiErrorDb.findRecent).toHaveBeenCalledWith(20, undefined, undefined);
    });
  });

  describe('GET /errors/stats', () => {
    it('returns stats without filters', async () => {
      mockApiErrorDb.getStats.mockResolvedValue({ total: 10, byStatus: { '500': 5, '401': 3, '404': 2 } });

      const result = await controller.getErrorStats();

      expect(apiErrorDb.getStats).toHaveBeenCalledWith(undefined);
      expect(result.total).toBe(10);
      expect(result.byStatus['500']).toBe(5);
    });

    it('passes minStatus/maxStatus filters', async () => {
      await controller.getErrorStats('400', '499');

      expect(apiErrorDb.getStats).toHaveBeenCalledWith({ minStatus: 400, maxStatus: 499 });
    });

    it('passes search filter', async () => {
      await controller.getErrorStats(undefined, undefined, '/api/v1');

      expect(apiErrorDb.getStats).toHaveBeenCalledWith({ search: '/api/v1' });
    });
  });

  describe('DELETE /errors', () => {
    it('clears both DB and memory store', async () => {
      const result = await controller.clearErrors();

      expect(apiErrorDb.clear).toHaveBeenCalled();
      expect(errorStore.clear).toHaveBeenCalled();
      expect(result).toEqual({ cleared: true });
    });
  });
});
