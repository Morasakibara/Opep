import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentProvider, PaymentStatus } from '../entities/payment.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import { WebhookPaymentDto, RefundPaymentDto } from '../dto/webhook-payment.dto';
import { AuditService } from '../../audit/services/audit.service';
import Redis from 'ioredis';
import { TicketsService } from '../../tickets/services/tickets.service';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly dataSource: DataSource,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly ticketsService: TicketsService,
    private readonly auditService: AuditService,
  ) {}

  async processPayment(dto: ProcessPaymentDto): Promise<Payment> {
    const { reservationId, provider, phoneNumber, stripeToken } = dto;

    // 1. Get Reservation
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (reservation.status !== ReservationStatus.PENDING_PAYMENT) {
      throw new BadRequestException('La réservation n\'est pas en attente de paiement');
    }

    // 2. Simulate Payment Process
    let transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    let status = PaymentStatus.SUCCESS;
    let failureReason = null;

    if (provider === PaymentProvider.MTN_MOMO || provider === PaymentProvider.ORANGE_MONEY) {
      if (!phoneNumber) throw new BadRequestException('Le numéro de téléphone est requis pour Mobile Money');
      // Mock: Failed if number ends with 000
      if (phoneNumber.endsWith('000')) {
        status = PaymentStatus.FAILED;
        failureReason = 'Provision insuffisante (Mock)';
      }
    } else if (provider === PaymentProvider.STRIPE) {
      if (!stripeToken) throw new BadRequestException('Le token Stripe est requis');
      // Mock Stripe process
    }

    // 3. Create Payment record and Update Reservation in Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = this.paymentRepository.create({
        reservationId,
        amount: reservation.totalAmount,
        provider,
        providerTransactionId: transactionId,
        status,
        paymentMethod: dto.paymentMethod || 'electronic',
        failureReason,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      if (status === PaymentStatus.SUCCESS) {
        reservation.status = ReservationStatus.CONFIRMED;
        await queryRunner.manager.save(reservation);
      }

      await queryRunner.commitTransaction();

      // Trigger ticket generation outside transaction to avoid locking DB too long
      if (status === PaymentStatus.SUCCESS) {
        await this.ticketsService.generateTicketsForReservation(reservationId);
      }

      // Audit après transaction
      this.auditService.log({
        userId: reservation.clientId,
        action: status === PaymentStatus.SUCCESS ? 'PAYMENT_PROCESSED' : 'PAYMENT_FAILED',
        entityType: 'payment',
        entityId: savedPayment.id,
        metadata: {
          reservationId,
          amount: savedPayment.amount,
          provider: savedPayment.provider,
          status: savedPayment.status,
          failureReason: savedPayment.failureReason,
        },
      }).catch(() => {});

      return savedPayment;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getReservationPayment(reservationId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { reservationId },
      order: { createdAt: 'DESC' },
    });
  }

  // ============ Refund ============

  async refundPayment(
    paymentId: string,
    refundDto: RefundPaymentDto,
    refundedBy: string,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Paiement non trouve');
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Ce paiement a deja ete rembourse');
    }

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Seuls les paiements reussis peuvent etre rembourses');
    }

    const refundAmount = refundDto.amount ?? payment.amount;

    if (refundAmount > payment.amount) {
      throw new BadRequestException('Le montant du remboursement depasse le montant du paiement');
    }

    // Update payment as refunded
    payment.status = PaymentStatus.REFUNDED;
    payment.refundedAt = new Date();
    payment.refundedBy = refundedBy;
    payment.refundAmount = refundAmount;

    const savedPayment = await this.paymentRepository.save(payment);

    // Cancel associated reservation
    const reservation = await this.reservationRepository.findOne({
      where: { id: payment.reservationId },
    });

    if (reservation && reservation.status === ReservationStatus.CONFIRMED) {
      reservation.status = ReservationStatus.CANCELLED;
      reservation.cancelledAt = new Date();
      reservation.cancelledBy = refundedBy;
      reservation.cancelReason = refundDto.reason || 'Remboursement du paiement';
      await this.reservationRepository.save(reservation);
    }

    // Audit
    this.auditService.log({
      userId: refundedBy,
      action: 'PAYMENT_REFUNDED',
      entityType: 'payment',
      entityId: payment.id,
      metadata: {
        originalAmount: payment.amount,
        refundedAmount: refundAmount,
        reason: refundDto.reason,
        reservationId: payment.reservationId,
      },
    }).catch(() => {});

    return savedPayment;
  }

  // ============ Webhook Handler ============

  async handleWebhook(
    provider: PaymentProvider,
    dto: WebhookPaymentDto,
  ): Promise<{ received: boolean }> {
    // Look up existing payment by provider transaction ID
    const existingPayment = await this.paymentRepository.findOne({
      where: { providerTransactionId: dto.transactionId, provider },
    });

    if (existingPayment) {
      // Update payment status based on webhook
      if (dto.status === 'SUCCESS' && existingPayment.status === PaymentStatus.PENDING) {
        existingPayment.status = PaymentStatus.SUCCESS;
        existingPayment.providerReference = dto.reference;
        await this.paymentRepository.save(existingPayment);

        // Confirm reservation and generate tickets
        const reservation = await this.reservationRepository.findOne({
          where: { id: existingPayment.reservationId },
        });
        if (reservation && reservation.status === ReservationStatus.PENDING_PAYMENT) {
          reservation.status = ReservationStatus.CONFIRMED;
          await this.reservationRepository.save(reservation);
          await this.ticketsService.generateTicketsForReservation(existingPayment.reservationId);
        }
      } else if (dto.status === 'FAILED') {
        existingPayment.status = PaymentStatus.FAILED;
        existingPayment.failureReason = 'Echec confirme par le prestataire';
        await this.paymentRepository.save(existingPayment);
      }

      this.auditService.log({
        action: `WEBHOOK_${provider}_${dto.status}`,
        entityType: 'payment',
        entityId: existingPayment.id,
        metadata: dto.metadata || {},
      }).catch(() => {});
    } else {
      // Payment not found in our system — log for investigation but don't fail
      console.warn(`[WEBHOOK] Paiement inconnu: ${provider} / ${dto.transactionId}`);
    }

    return { received: true };
  }
}
