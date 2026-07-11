import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationEntity, NotificationType, NotificationChannel, NotificationStatus } from './entities/notification.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { AuditService } from '../audit/services/audit.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectQueue('notifications-queue') private readonly notificationsQueue: Queue,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Schedule departure reminders for a reservation at 1h, 30min, 15min, 5min before departure
   */
  async scheduleDepartureReminders(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['trip', 'trip.route', 'client'],
    });

    if (!reservation || !reservation.trip) return;

    const departureTime = new Date(reservation.trip.departureDateTime).getTime();
    const now = Date.now();
    const delays = [
      { type: NotificationType.DEPARTURE_1H, minutes: 60 },
      { type: NotificationType.DEPARTURE_30MIN, minutes: 30 },
      { type: NotificationType.DEPARTURE_15MIN, minutes: 15 },
      { type: NotificationType.DEPARTURE_5MIN, minutes: 5 },
    ];

    const departureCity = reservation.trip.route?.departureCity || '';

    for (const { type, minutes } of delays) {
      const scheduledTime = departureTime - minutes * 60 * 1000;

      // Only schedule if departure time is in the future AND the reminder time hasn't passed
      if (scheduledTime <= now) continue;

      const channel = (type === NotificationType.DEPARTURE_1H || type === NotificationType.DEPARTURE_5MIN)
        ? NotificationChannel.SMS
        : NotificationChannel.PUSH;

      // Save notification in DB
      const notification = this.notificationRepository.create({
        userId: reservation.clientId,
        reservationId: reservation.id,
        tripId: reservation.tripId,
        type,
        channel,
        title: this.getTitle(type),
        message: this.getMessage(type, departureCity),
        scheduledAt: new Date(scheduledTime),
        status: NotificationStatus.PENDING,
      });

      const saved = await this.notificationRepository.save(notification);

      // Schedule BullMQ job
      const delay = Math.max(0, scheduledTime - now);
      await this.notificationsQueue.add(
        'send-notification',
        {
          notificationId: saved.id,
          userId: reservation.clientId,
          type,
          channel,
          title: saved.title,
          message: saved.message,
          phoneNumber: reservation.client?.notificationPhone,
        },
        {
          delay,
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: true,
        },
      );
    }
  }

  /**
   * Cancel all pending notifications for a reservation
   */
  async cancelReservationNotifications(reservationId: string): Promise<void> {
    await this.notificationRepository.update(
      { reservationId, status: NotificationStatus.PENDING },
      { status: NotificationStatus.CANCELLED },
    );
  }

  /**
   * Mark a notification as sent
   */
  async markAsSent(notificationId: string): Promise<void> {
    await this.notificationRepository.update(notificationId, {
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    });
  }

  /**
   * Mark a notification as failed
   */
  async markAsFailed(notificationId: string, errorMessage: string): Promise<void> {
    await this.notificationRepository.update(notificationId, {
      status: NotificationStatus.FAILED,
      errorMessage,
    });
  }

  /**
   * Send a notification via the appropriate channel (mock implementation)
   */
  async sendNotification(notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification || notification.status !== NotificationStatus.PENDING) return;

    try {
      // Mock sending via different channels
      switch (notification.channel) {
        case NotificationChannel.SMS:
          // In production: use Africa's Talking SMS API
          console.log(`[SMS] Envoi à ${notification.userId}: ${notification.message}`);
          break;
        case NotificationChannel.WHATSAPP:
          // In production: use Africa's Talking WhatsApp API
          console.log(`[WhatsApp] Envoi à ${notification.userId}: ${notification.message}`);
          break;
        case NotificationChannel.PUSH:
          // In production: use Firebase Cloud Messaging
          console.log(`[Push] Envoi à ${notification.userId}: ${notification.message}`);
          break;
        case NotificationChannel.EMAIL:
          // In production: use Nodemailer
          console.log(`[Email] Envoi à ${notification.userId}: ${notification.message}`);
          break;
      }

      await this.markAsSent(notificationId);

      this.auditService.log({
        userId: notification.userId,
        action: `NOTIFICATION_${notification.type}`,
        entityType: 'notification',
        entityId: notification.id,
        metadata: {
          type: notification.type,
          channel: notification.channel,
          message: notification.message,
        },
      }).catch(() => {});
    } catch (err) {
      await this.markAsFailed(notificationId, err.message);
    }
  }

  private getTitle(type: NotificationType): string {
    const titles = {
      [NotificationType.DEPARTURE_1H]: 'Départ dans 1 heure',
      [NotificationType.DEPARTURE_30MIN]: 'Départ dans 30 minutes',
      [NotificationType.DEPARTURE_15MIN]: 'Départ dans 15 minutes',
      [NotificationType.DEPARTURE_5MIN]: 'Départ dans 5 minutes',
      [NotificationType.TRIP_MODIFIED]: 'Voyage modifié',
      [NotificationType.BUS_CHANGED]: 'Bus changé',
      [NotificationType.DRIVER_CHANGED]: 'Chauffeur changé',
    };
    return titles[type] || 'Notification';
  }

  private getMessage(type: NotificationType, departureCity: string): string {
    const messages = {
      [NotificationType.DEPARTURE_1H]: `Votre départ pour ${departureCity} est dans 1 heure. Présentez-vous à la gare avec votre ticket QR.`,
      [NotificationType.DEPARTURE_30MIN]: `Votre départ pour ${departureCity} est dans 30 minutes.`,
      [NotificationType.DEPARTURE_15MIN]: `Votre départ pour ${departureCity} est dans 15 minutes. Embarquez maintenant !`,
      [NotificationType.DEPARTURE_5MIN]: `Votre départ pour ${departureCity} est dans 5 minutes ! Le bus va partir.`,
      [NotificationType.TRIP_MODIFIED]: 'Les détails de votre voyage ont été modifiés. Vérifiez vos tickets.',
      [NotificationType.BUS_CHANGED]: 'Le bus assigné à votre voyage a été changé.',
      [NotificationType.DRIVER_CHANGED]: 'Le chauffeur assigné à votre voyage a été changé.',
    };
    return messages[type] || '';
  }
}
