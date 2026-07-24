import { AllExceptionsFilter } from './all-exceptions.filter';
import { ErrorStoreService, StoredError } from './error-store.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// ---- Mock helpers ----

function mockHttpAdapterHost(): HttpAdapterHost {
  const reply = jest.fn();
  const httpAdapter = { reply };
  return { httpAdapter } as unknown as HttpAdapterHost;
}

function mockArgs(method = 'GET', url = '/api/v1/test'): any {
  const request = { method, url, ip: '127.0.0.1', headers: { 'user-agent': 'test-agent' } };
  const response = {};
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
      getNext: () => jest.fn(),
    }),
  };
}

describe('ErrorStoreService', () => {
  let store: ErrorStoreService;

  beforeEach(() => {
    store = new ErrorStoreService();
  });

  describe('push() and getRecent()', () => {
    it('stores and returns errors in LIFO order', () => {
      store.push({ timestamp: '2024-01-01', method: 'GET', url: '/a', statusCode: 500, message: 'err1' });
      store.push({ timestamp: '2024-01-02', method: 'POST', url: '/b', statusCode: 401, message: 'err2' });

      const recent = store.getRecent();
      expect(recent).toHaveLength(2);
      expect(recent[0].message).toBe('err2'); // most recent first
      expect(recent[1].message).toBe('err1');
    });

    it('caps at 100 entries', () => {
      for (let i = 0; i < 150; i++) {
        store.push({ timestamp: 't', method: 'GET', url: `/url/${i}`, statusCode: 500, message: `err${i}` });
      }
      expect(store.getRecent(100)).toHaveLength(100);
      expect(store.getRecent(100)[0].message).toBe('err149');
      expect(store.getRecent(100)[99].message).toBe('err50');
    });

    it('assigns a unique id to each entry', () => {
      store.push({ timestamp: 't', method: 'GET', url: '/a', statusCode: 500, message: 'a' });
      store.push({ timestamp: 't', method: 'GET', url: '/b', statusCode: 500, message: 'b' });
      const [a, b] = store.getRecent();
      expect(a.id).toBeDefined();
      expect(b.id).toBeDefined();
      expect(a.id).not.toBe(b.id);
    });
  });

  describe('getStats()', () => {
    it('returns correct counts grouped by status code', () => {
      store.push({ timestamp: 't', method: 'GET', url: '/a', statusCode: 500, message: 'a' });
      store.push({ timestamp: 't', method: 'GET', url: '/b', statusCode: 500, message: 'b' });
      store.push({ timestamp: 't', method: 'GET', url: '/c', statusCode: 401, message: 'c' });

      const stats = store.getStats();
      expect(stats.total).toBe(3);
      expect(stats.byStatus['500']).toBe(2);
      expect(stats.byStatus['401']).toBe(1);
    });

    it('returns 0 total for empty store', () => {
      const stats = store.getStats();
      expect(stats.total).toBe(0);
      expect(stats.byStatus).toEqual({});
    });
  });

  describe('clear()', () => {
    it('removes all stored errors', () => {
      store.push({ timestamp: 't', method: 'GET', url: '/a', statusCode: 500, message: 'a' });
      store.clear();
      expect(store.getRecent()).toHaveLength(0);
      expect(store.getStats().total).toBe(0);
    });
  });
});

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let errorStore: ErrorStoreService;
  let httpAdapterHost: HttpAdapterHost;

  beforeEach(() => {
    errorStore = new ErrorStoreService();
    httpAdapterHost = mockHttpAdapterHost();
    filter = new AllExceptionsFilter(httpAdapterHost, errorStore);
  });

  it('handles HttpException and stores it in error store', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const host = mockArgs('GET', '/api/v1/users');

    filter.catch(exception, host);

    const recent = errorStore.getRecent();
    expect(recent).toHaveLength(1);
    expect(recent[0].statusCode).toBe(404);
    expect(recent[0].method).toBe('GET');
    expect(recent[0].url).toBe('/api/v1/users');
    expect(recent[0].message).toBe('Not Found');

    // Verify reply was called with sanitised response
    const replyMock = httpAdapterHost.httpAdapter.reply as jest.Mock;
    expect(replyMock).toHaveBeenCalledTimes(1);
    const responseBody = replyMock.mock.calls[0][1];
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('message', 'Not Found');
    expect(responseBody).toHaveProperty('path', '/api/v1/users');
    expect(responseBody).not.toHaveProperty('stack'); // no stack leak
  });

  it('handles non-HttpException as 500', () => {
    const exception = new Error('Database connection failed');
    const host = mockArgs('POST', '/api/v1/trips');

    filter.catch(exception, host);

    const recent = errorStore.getRecent();
    expect(recent).toHaveLength(1);
    expect(recent[0].statusCode).toBe(500);
    expect(recent[0].message).toBe('Erreur interne du serveur');
    expect(recent[0].stack).toContain('Error: Database connection failed');

    const replyMock = httpAdapterHost.httpAdapter.reply as jest.Mock;
    const responseBody = replyMock.mock.calls[0][1];
    expect(responseBody.statusCode).toBe(500);
    expect(responseBody.message).toBe('Erreur interne du serveur');
  });

  it('works without ErrorStoreService (optional dependency)', () => {
    const filterWithoutStore = new AllExceptionsFilter(httpAdapterHost, undefined);
    const exception = new HttpException('Test', HttpStatus.BAD_REQUEST);
    const host = mockArgs('GET', '/api/v1/test');

    expect(() => filterWithoutStore.catch(exception, host)).not.toThrow();

    const replyMock = httpAdapterHost.httpAdapter.reply as jest.Mock;
    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock.mock.calls[0][1].statusCode).toBe(400);
  });

  it('stores 5xx errors with stack trace for debugging', () => {
    const exception = new Error('Internal server crash');
    const host = mockArgs('DELETE', '/api/v1/users/1');

    filter.catch(exception, host);

    const recent = errorStore.getRecent();
    expect(recent[0].stack).toBeDefined();
    expect(recent[0].stack).toContain('Internal server crash');
  });

  it('stores 4xx errors for monitoring', () => {
    const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const host = mockArgs('GET', '/api/v1/incidents');

    filter.catch(exception, host);

    const recent = errorStore.getRecent();
    expect(recent[0].statusCode).toBe(401);
    expect(recent[0].message).toBe('Unauthorized');
  });
});
