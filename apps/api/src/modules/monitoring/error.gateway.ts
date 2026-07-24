import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * WebSocket gateway that emits real-time error notifications.
 * Admin users can connect to receive 5xx error alerts.
 */
@WebSocketGateway({
  namespace: '/errors',
  cors: { origin: '*', credentials: true },
})
export class ErrorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ErrorGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string);

      if (!token) {
        client.emit('error', { message: 'Token requis' });
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const role = payload.role as string;

      // Seuls les admins peuvent recevoir les notifications d'erreurs
      const allowedRoles = ['ADMIN_PLATFORM', 'COMPANY_DIRECTOR', 'AGENCY_MANAGER'];
      if (!allowedRoles.includes(role)) {
        client.emit('error', { message: `Rôle non autorisé: ${role}` });
        client.disconnect();
        return;
      }

      client.data.user = { id: payload.sub, role };
      this.logger.log(`Admin connecté au monitoring: ${client.id} (${role})`);
    } catch (err) {
      client.emit('error', { message: 'Token invalide' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Admin déconnecté du monitoring: ${client.id}`);
  }

  /**
   * Broadcast an error event to all connected admin clients.
   */
  emitError(error: {
    id?: string;
    timestamp: string;
    method: string;
    url: string;
    statusCode: number;
    message: string;
    stack?: string;
  }) {
    this.server.emit('error-event', error);
  }
}
