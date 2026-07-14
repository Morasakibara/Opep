import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Processor('notifications-queue', {
  concurrency: 5,
})
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async process(job: Job<{
    notificationId: string;
    userId: string;
    type: string;
    channel: string;
    title: string;
    message: string;
    phoneNumber?: string;
  }>): Promise<void> {
    const { notificationId } = job.data;

    this.logger.log(`Envoi de la notification ${notificationId} (job ${job.id})`);

    try {
      await this.notificationService.sendNotification(notificationId);
      this.logger.log(`✅ Notification ${notificationId} envoyée`);
    } catch (err) {
      this.logger.error(`❌ Erreur notification ${notificationId}: ${err.message}`);
      throw err; // BullMQ will retry based on job options
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} terminé (notification ${job.data?.notificationId})`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} échoué après ${job.attemptsMade} tentatives: ${err.message}`);
  }
}
