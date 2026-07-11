import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { GpsGateway } from './gps.gateway';
import { UserRole } from '@opep/shared-types';

describe('GpsGateway', () => {
  let gateway: GpsGateway;
  let jwtService: jest.Mocked<JwtService>;
  let mockServer: jest.Mocked<Partial<Server>>;
  let mockClient: jest.Mocked<Partial<Socket>>;

  const validTokenPayload = {
    sub: 'user-1',
    email: 'driver@test.com',
    role: UserRole.DRIVER,
    agencyId: 'agency-1',
  };

  function createMockClient() {
    return {
      id: 'socket-1',
      handshake: {
        auth: {},
        query: {},
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
        GpsGateway,
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    gateway = module.get<GpsGateway>(GpsGateway);
    gateway.server = mockServer as unknown as Server;
    mockClient = createMockClient();
  });

  describe('handleConnection', () => {
    it('accepte un client DRIVER avec un token valide', async () => {
      jwtService.verifyAsync.mockResolvedValue(validTokenPayload);
      mockClient.handshake.auth = { token: 'valid.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid.jwt.token');
      expect(mockClient.data.user).toEqual({
        id: 'user-1',
        email: 'driver@test.com',
        role: UserRole.DRIVER,
        agencyId: 'agency-1',
      });
      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });

    it('accepte un client CLIENT avec un token valide', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        ...validTokenPayload,
        role: UserRole.CLIENT,
      });
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

    it('rejette un ADMIN_PLATFORM (rôle non autorisé)', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        ...validTokenPayload,
        role: UserRole.ADMIN_PLATFORM,
      });
      mockClient.handshake.auth = { token: 'admin.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: expect.stringContaining('Rôle non autorisé'),
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('rejette un CASHIER (rôle non autorisé)', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        ...validTokenPayload,
        role: UserRole.CASHIER,
      });
      mockClient.handshake.auth = { token: 'cashier.jwt.token' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: expect.stringContaining('Rôle non autorisé'),
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('extrait le token depuis query quand auth est vide', async () => {
      jwtService.verifyAsync.mockResolvedValue(validTokenPayload);
      mockClient.handshake.auth = {};
      mockClient.handshake.query = { token: 'query.token.value' };

      await gateway.handleConnection(mockClient as unknown as Socket);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('query.token.value');
      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('nettoie les souscriptions du client déconnecté', async () => {
      // Setup: subscribe to two trips first
      jwtService.verifyAsync.mockResolvedValue(validTokenPayload);
      mockClient.handshake.auth = { token: 'valid.jwt.token' };
      await gateway.handleConnection(mockClient as unknown as Socket);

      gateway.handleSubscribeTrip(mockClient as unknown as Socket, { tripId: 'trip-1' });
      gateway.handleSubscribeTrip(mockClient as unknown as Socket, { tripId: 'trip-2' });

      expect(gateway.getSubscriberCount('trip-1')).toBe(1);
      expect(gateway.getSubscriberCount('trip-2')).toBe(1);

      // Disconnect
      await gateway.handleDisconnect(mockClient as unknown as Socket);

      expect(gateway.getSubscriberCount('trip-1')).toBe(0);
      expect(gateway.getSubscriberCount('trip-2')).toBe(0);
    });
  });

  describe('subscribe-trip', () => {
    it('abonne un client à un voyage et rejoint le room', () => {
      mockClient.data = { user: validTokenPayload };

      const result = gateway.handleSubscribeTrip(mockClient as unknown as Socket, { tripId: 'trip-1' });

      expect(mockClient.join).toHaveBeenCalledWith('trip:trip-1');
      expect(result).toEqual({ event: 'subscribed', data: { tripId: 'trip-1' } });
    });

    it('retourne une erreur si tripId est manquant', () => {
      const result = gateway.handleSubscribeTrip(mockClient as unknown as Socket, { tripId: '' });

      expect(result).toEqual({ event: 'error', data: { message: expect.stringContaining('requis') } });
    });
  });

  describe('unsubscribe-trip', () => {
    it('désabonne un client et quitte le room', () => {
      mockClient.data = { user: validTokenPayload };

      // Subscribe first
      gateway.handleSubscribeTrip(mockClient as unknown as Socket, { tripId: 'trip-1' });
      expect(gateway.getSubscriberCount('trip-1')).toBe(1);

      // Then unsubscribe
      const result = gateway.handleUnsubscribeTrip(mockClient as unknown as Socket, { tripId: 'trip-1' });

      expect(mockClient.leave).toHaveBeenCalledWith('trip:trip-1');
      expect(result).toEqual({ event: 'unsubscribed', data: { tripId: 'trip-1' } });
      expect(gateway.getSubscriberCount('trip-1')).toBe(0);
    });
  });

  describe('update-location', () => {
    it('broadcast la position à tous les abonnés du voyage', () => {
      gateway.handleSubscribeTrip(mockClient as unknown as Socket, { tripId: 'trip-1' });

      const result = gateway.handleLocationUpdate(mockClient as unknown as Socket, {
        tripId: 'trip-1',
        latitude: 4.051,
        longitude: 9.767,
        speed: 60,
        heading: 180,
        timestamp: '',
      });

      expect(mockServer.to).toHaveBeenCalledWith('trip:trip-1');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'location-update',
        expect.objectContaining({
          tripId: 'trip-1',
          latitude: 4.051,
          longitude: 9.767,
          speed: 60,
          heading: 180,
        }),
      );
      expect(result).toEqual({ event: 'location-received', data: { tripId: 'trip-1' } });
    });

    it('retourne une erreur si des champs requis sont manquants', () => {
      const result = gateway.handleLocationUpdate(mockClient as unknown as Socket, {
        tripId: '',
        latitude: null as any,
        longitude: null as any,
        timestamp: '',
      });

      expect(result).toEqual({ event: 'error', data: { message: expect.stringContaining('requis') } });
    });
  });

  describe('broadcastLocation', () => {
    it('broadcast via le serveur à tous les abonnés du room', () => {
      gateway.broadcastLocation('trip-1', {
        latitude: 4.051,
        longitude: 9.767,
        speed: 80,
        heading: 90,
      });

      expect(mockServer.to).toHaveBeenCalledWith('trip:trip-1');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'location-update',
        expect.objectContaining({
          tripId: 'trip-1',
          latitude: 4.051,
          longitude: 9.767,
          speed: 80,
          heading: 90,
        }),
      );
    });
  });

  describe('getSubscriberCount', () => {
    it('retourne 0 si aucun abonné', () => {
      expect(gateway.getSubscriberCount('trip-unknown')).toBe(0);
    });

    it('retourne le nombre d\'abonnés', () => {
      gateway.handleSubscribeTrip(mockClient as unknown as Socket, { tripId: 'trip-1' });
      expect(gateway.getSubscriberCount('trip-1')).toBe(1);
    });
  });
});
