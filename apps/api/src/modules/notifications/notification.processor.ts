import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationService } from './notification.service';

@Processor('notifications-queue', {
  concurrency: 5,
})
export class NotificationProcessor extends WorkerHost {
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

    console.log(`[Notifications] Envoi de la notification ${notificationId} (job ${job.id})`);

    try {
      await this.notificationService.sendNotification(notificationId);
      console.log(`[Notifications] ✅ Notification ${notificationId} envoyée`);
    } catch (err) {
      console.error(`[Notifications] ❌ Erreur notification ${notificationId}:`, err.message);
      throw err; // BullMQ will retry based on job options
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`[Notifications] Job ${job.id} terminé (notification ${job.data?.notificationId})`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`[Notifications] Job ${job.id} échoué après ${job.attemptsMade} tentatives:`, err.message);
  }
}
