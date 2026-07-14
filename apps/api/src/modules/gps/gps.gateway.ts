import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserRole } from '@opep/shared-types';

interface LocationUpdate {
  tripId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

// Rôles autorisés à se connecter au namespace GPS
const ALLOWED_ROLES: UserRole[] = [UserRole.DRIVER, UserRole.CLIENT];

@WebSocketGateway({
  namespace: '/gps',
  cors: { origin: '*', credentials: true },
})
export class GpsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GpsGateway.name);

  @WebSocketServer()
  server: Server;

  // Track clients subscribed to each trip
  private tripSubscriptions = new Map<string, Set<string>>();
  // Track which trips each client is subscribed to
  private clientSubscriptions = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake auth (Socket.IO) or query parameter
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string);

      if (!token) {
        client.emit('error', { message: 'Token d\'authentification requis' });
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        agencyId: payload.agencyId,
      };

      // Vérifier que le rôle est autorisé (DRIVER ou CLIENT)
      const userRole = payload.role as UserRole;
      if (!ALLOWED_ROLES.includes(userRole)) {
        client.emit('error', {
          message: `Rôle non autorisé: ${userRole}. Seuls DRIVER et CLIENT peuvent se connecter.`,
        });
        client.disconnect();
        return;
      }

      this.logger.log(`Client authentifié: ${client.id} (${userRole})`);
    } catch (err) {
      client.emit('error', { message: 'Token invalide ou expiré' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // Clean up all subscriptions for this client
    const trips = this.clientSubscriptions.get(client.id);
    if (trips) {
      for (const tripId of trips) {
        const subscribers = this.tripSubscriptions.get(tripId);
        if (subscribers) {
          subscribers.delete(client.id);
          if (subscribers.size === 0) {
            this.tripSubscriptions.delete(tripId);
          }
        }
      }
      this.clientSubscriptions.delete(client.id);
    }
    this.logger.log(`Client déconnecté: ${client.id}`);
  }

  @SubscribeMessage('subscribe-trip')
  handleSubscribeTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string },
  ) {
    const { tripId } = data;
    if (!tripId) return { event: 'error', data: { message: 'tripId requis' } };

    // Add client to trip subscribers
    if (!this.tripSubscriptions.has(tripId)) {
      this.tripSubscriptions.set(tripId, new Set());
    }
    this.tripSubscriptions.get(tripId)!.add(client.id);

    // Track this trip for the client
    if (!this.clientSubscriptions.has(client.id)) {
      this.clientSubscriptions.set(client.id, new Set());
    }
    this.clientSubscriptions.get(client.id)!.add(tripId);

    // Join the Socket.IO room for this trip
    client.join(`trip:${tripId}`);

    this.logger.log(`Client ${client.id} abonné au voyage ${tripId}`);
    return { event: 'subscribed', data: { tripId } };
  }

  @SubscribeMessage('unsubscribe-trip')
  handleUnsubscribeTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string },
  ) {
    const { tripId } = data;
    if (!tripId) return { event: 'error', data: { message: 'tripId requis' } };

    // Remove from trip subscribers
    const subscribers = this.tripSubscriptions.get(tripId);
    if (subscribers) {
      subscribers.delete(client.id);
      if (subscribers.size === 0) {
        this.tripSubscriptions.delete(tripId);
      }
    }

    // Remove from client tracking
    const clientTrips = this.clientSubscriptions.get(client.id);
    if (clientTrips) {
      clientTrips.delete(tripId);
      if (clientTrips.size === 0) {
        this.clientSubscriptions.delete(client.id);
      }
    }

    client.leave(`trip:${tripId}`);
    this.logger.log(`Client ${client.id} désabonné du voyage ${tripId}`);
    return { event: 'unsubscribed', data: { tripId } };
  }

  @SubscribeMessage('update-location')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LocationUpdate,
  ) {
    const { tripId, latitude, longitude, speed, heading } = data;

    if (!tripId || latitude == null || longitude == null) {
      return { event: 'error', data: { message: 'tripId, latitude et longitude requis' } };
    }

    const locationUpdate: LocationUpdate = {
      tripId,
      latitude,
      longitude,
      speed,
      heading,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all clients subscribed to this trip (including sender)
    this.server.to(`trip:${tripId}`).emit('location-update', locationUpdate);

    return { event: 'location-received', data: { tripId } };
  }

  /**
   * Broadcast a location update to all subscribers of a trip.
   * Can be called from services (e.g., when a driver app sends GPS data via HTTP).
   */
  broadcastLocation(tripId: string, location: Omit<LocationUpdate, 'tripId' | 'timestamp'>) {
    const update: LocationUpdate = {
      tripId,
      ...location,
      timestamp: new Date().toISOString(),
    };
    this.server.to(`trip:${tripId}`).emit('location-update', update);
  }

  /**
   * Get the number of active subscribers for a trip.
   */
  getSubscriberCount(tripId: string): number {
    return this.tripSubscriptions.get(tripId)?.size || 0;
  }
}
