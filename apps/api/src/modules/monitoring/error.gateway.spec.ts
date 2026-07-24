import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ErrorGateway } from './error.gateway';

describe('ErrorGateway', () => {
  let gateway: ErrorGateway;
  let jwtService: jest.Mocked<JwtService>;
  let mockServer: jest.Mocked<Partial<Server>>;
  let mockClient: jest.Mocked<Partial<Socket>>;

  const adminPayload = {
    sub: 'admin-1',
    email: 'admin@opep.cm',
    role: 'ADMIN_PLATFORM',
  };

  const directorPayload = {
    sub: 'director-1',
    email: 'director@company.cm',
    role: 'COMPANY_DIRECTOR',
  };

  const managerPayload = {
    sub: 'manager-1',
    email: 'manager@agency.cm',
    role: 'AGENCY_MANAGER',
  };

  const driverPayload = {
    sub: 'driver-1',
    email: 'driver@test.com',
    role: 'DRIVER',
  };

  function createMockClient() {
    return {
      id: 'socket-1',
      handshake: {
        auth: {} as Record<string, any>,
        query: {} as Record<string, any>,
        headers: {},
        time: new Date().toISOString(),
        address: '',
        xdomain: false,
        secure: false,
        issued: 0,
        url: '',
      },
      data: {},
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as jest.Mocked<Socket>;
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    jwtService = {
      verifyAsync: jest.fn(),
      verify: jest.fn(),
      sign: jest.fn(),
      signAsync: jest.fn(),
      decode: jest.fn(),
    } as any;

    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        ErrorGateway,
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    gateway = module.get<ErrorGateway>(ErrorGateway);
    gateway.server = mockServer as unknown as Server;
    mockClient = createMockClient();
  });

  describe('handleConnection', () => {
    it('accepte un ADMIN_PLATFORM avec un token valide', async () => {
      jwtService.verifyAsync.mockResolvedValue(adminPayload);
      mockClient.handshake.auth = { token: 'valid.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid.jwt.token');
      expect(mockClient.data.user).toEqual({
        id: 'admin-1',
        role: 'ADMIN_PLATFORM',
      });
      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });

    it('accepte un COMPANY_DIRECTOR avec un token valide', async () => {
      jwtService.verifyAsync.mockResolvedValue(directorPayload);
      mockClient.handshake.auth = { token: 'valid.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });

    it('accepte un AGENCY_MANAGER avec un token valide', async () => {
      jwtService.verifyAsync.mockResolvedValue(managerPayload);
      mockClient.handshake.auth = { token: 'valid.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });

    it('rejette un client sans token', async () => {
      mockClient.handshake.auth = {};

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: expect.stringContaining('requis'),
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('rejette un client avec un token invalide', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Token expired'));
      mockClient.handshake.auth = { token: 'expired.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: expect.stringContaining('invalide'),
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('rejette un DRIVER (rôle non autorisé)', async () => {
      jwtService.verifyAsync.mockResolvedValue(driverPayload);
      mockClient.handshake.auth = { token: 'driver.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: expect.stringContaining('Rôle non autorisé'),
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('rejette un CASHIER (rôle non autorisé)', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'cashier-1',
        role: 'CASHIER',
      });
      mockClient.handshake.auth = { token: 'cashier.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: expect.stringContaining('Rôle non autorisé'),
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('extrait le token depuis query quand auth est vide', async () => {
      jwtService.verifyAsync.mockResolvedValue(adminPayload);
      mockClient.handshake.auth = {};
      mockClient.handshake.query = { token: 'query.token.value' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('query.token.value');
      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('logge la déconnexion', async () => {
      const loggerSpy = jest.spyOn(gateway['logger'], 'log');

      await gateway.handleDisconnect(mockClient as unknown as Socket);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('déconnecté'),
      );
    });
  });

  describe('emitError', () => {
    it('broadcast une erreur à tous les clients connectés', () => {
      const errorPayload = {
        timestamp: '2024-01-01T00:00:00.000Z',
        method: 'GET',
        url: '/api/v1/test',
        statusCode: 500,
        message: 'Internal server error',
        stack: 'Error: test\n    at Object.<anonymous> (test.ts:1:1)',
      };

      gateway.emitError(errorPayload);

      expect(mockServer.emit).toHaveBeenCalledWith('error-event', errorPayload);
    });

    it('broadcast sans stack trace si non fournie', () => {
      gateway.emitError({
        timestamp: '2024-01-01T00:00:00.000Z',
        method: 'POST',
        url: '/api/v1/users',
        statusCode: 401,
        message: 'Unauthorized',
      });

      expect(mockServer.emit).toHaveBeenCalledWith('error-event', {
        timestamp: '2024-01-01T00:00:00.000Z',
        method: 'POST',
        url: '/api/v1/users',
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('broadcast avec un id optionnel', () => {
      const errorPayload = {
        id: 'custom-id-123',
        timestamp: '2024-01-01T00:00:00.000Z',
        method: 'DELETE',
        url: '/api/v1/error',
        statusCode: 500,
        message: 'Critical error',
      };

      gateway.emitError(errorPayload);

      expect(mockServer.emit).toHaveBeenCalledWith('error-event', errorPayload);
    });
  });
});
