import { Controller, Get, UseGuards } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { AuditService } from '../audit/services/audit.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly auditService: AuditService) {}

  @Get('my')
  @SkipThrottle({ long: true, medium: true, short: true })
  @Throttle({ public: { limit: 30, ttl: 60000 } })
  async getMyNotifications(@GetUser('id') userId: string) {
    const logs = await this.auditService.getUserAudit(userId);
    return logs.map((log) => ({
      id: log.id,
      title: this.getTitle(log.action),
      message: this.getMessage(log),
      type: this.getType(log.action),
      date: log.createdAt,
    }));
  }

  private getTitle(action: string): string {
    const titles: Record<string, string> = {
      RESERVATION_CREATED: 'Réservation créée',
      TICKETS_GENERATED: 'Tickets générés',
      TICKET_SCANNED: 'Ticket scanné',
      TICKET_VALIDATION_FAILED: 'Validation échouée',
      PAYMENT_PROCESSED: 'Paiement effectué',
      PAYMENT_COMPLETED: 'Paiement effectué',
      PAYMENT_FAILED: 'Paiement échoué',
    };
    return titles[action] || 'Notification';
  }

  private getMessage(log: any): string {
    switch (log.action) {
      case 'RESERVATION_CREATED':
        return `Réservation ${log.metadata?.seatsCount || ''} place(s) - ${log.metadata?.totalAmount || 0} FCFA`;
      case 'TICKETS_GENERATED':
        return `${log.metadata?.ticketCount || ''} ticket(s) généré(s) pour la réservation ${log.metadata?.reservationCode || ''}`;
      case 'TICKET_SCANNED':
        return `Ticket de ${log.metadata?.passengerName || 'passager'} validé - Siège ${log.metadata?.seatNumber || ''}`;
      case 'PAYMENT_PROCESSED':
      case 'PAYMENT_COMPLETED':
        return `Paiement de ${log.metadata?.amount || 0} FCFA effectué avec succès`;
      case 'PAYMENT_FAILED':
        return `Paiement de ${log.metadata?.amount || 0} FCFA échoué - ${log.metadata?.failureReason || 'Erreur inconnue'}`;
      default:
        return log.action;
    }
  }

  private getType(action: string): string {
    switch (action) {
      case 'RESERVATION_CREATED':
      case 'PAYMENT_PROCESSED':
      case 'PAYMENT_COMPLETED':
        return 'SUCCESS';
      case 'PAYMENT_FAILED':
        return 'WARNING';
      case 'TICKET_VALIDATION_FAILED':
        return 'WARNING';
      case 'TICKETS_GENERATED':
      case 'TICKET_SCANNED':
      default:
        return 'INFO';
    }
  }
}
