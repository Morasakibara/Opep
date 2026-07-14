import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentProvider, PaymentStatus } from '../entities/payment.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { TicketsService } from '../../tickets/services/tickets.service';
import { AuditService } from '../../audit/services/audit.service';

interface MockPaymentJob {
  paymentId: string;
  reservationId: string;
  provider: PaymentProvider;
  amount: number;
  phoneNumber?: string;
}

@Processor('payments-queue')
export class PaymentsMockProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly ticketsService: TicketsService,
    private readonly auditService: AuditService,
  ) {
    super();
  }

  async process(job: Job<MockPaymentJob, any, string>): Promise<any> {
    const { paymentId, reservationId, provider, amount, phoneNumber } = job.data;

    // Simulate processing delay
    // MTN takes ~3s, Orange takes ~2s
    const delayMs = provider === PaymentProvider.MTN_MOMO ? 3000 : 2000;
    await new Promise(resolve => setTimeout(resolve, delayMs));

    // Determine success/failure based on mock rules
    const isFailed = phoneNumber?.endsWith('000');
    const failureReason = isFailed ? 'Provision insuffisante (Mock)' : null;

    // Update payment status
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      console.warn(`[PAYMENT_MOCK] Paiement introuvable: ${paymentId}`);
      return { received: false, reason: 'Payment not found' };
    }

    if (payment.status !== PaymentStatus.PENDING) {
      console.log(`[PAYMENT_MOCK] Paiement déjà traité: ${paymentId} (${payment.status})`);
      return { received: true, status: payment.status };
    }

    if (isFailed) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = failureReason;
      payment.metadata = { ...payment.metadata, mockProcessedAt: new Date().toISOString() };
      await this.paymentRepository.save(payment);

      console.log(`[PAYMENT_MOCK] Échec simulé ${provider}: ${paymentId}`);
    } else {
      payment.status = PaymentStatus.SUCCESS;
      payment.providerTransactionId = `${provider === PaymentProvider.MTN_MOMO ? 'MTN' : 'OM'}_MOCK_${paymentId.substring(0, 8).toUpperCase()}`;
      payment.metadata = { ...payment.metadata, mockProcessedAt: new Date().toISOString() };
      await this.paymentRepository.save(payment);

      // Confirm reservation
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
      });

      if (reservation && reservation.status === ReservationStatus.PENDING_PAYMENT) {
        reservation.status = ReservationStatus.CONFIRMED;
        await this.reservationRepository.save(reservation);

        // Generate tickets
        await this.ticketsService.generateTicketsForReservation(reservationId);

        console.log(`[PAYMENT_MOCK] Succès ${provider}: ${paymentId} — Réservation ${reservationId} confirmée`);
      }
    }

    // Audit
    this.auditService.log({
      action: isFailed ? 'PAYMENT_FAILED' : 'PAYMENT_PROCESSED',
      entityType: 'payment',
      entityId: paymentId,
      metadata: {
        provider,
        amount,
        reservationId,
        status: isFailed ? 'FAILED' : 'SUCCESS',
        mockDelay: delayMs,
        failureReason,
      },
    }).catch(() => {});

    return {
      received: true,
      status: isFailed ? 'FAILED' : 'SUCCESS',
      delayMs,
    };
  }
}
