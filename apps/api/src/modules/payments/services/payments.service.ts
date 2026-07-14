import { Injectable, BadRequestException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Payment, PaymentProvider, PaymentStatus } from '../entities/payment.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { ProcessPaymentDto, InitiatePaymentDto } from '../dto/process-payment.dto';
import { DepositPaymentDto } from '../dto/deposit-payment.dto';
import { WebhookPaymentDto, RefundPaymentDto } from '../dto/webhook-payment.dto';
import { AuditService } from '../../audit/services/audit.service';
import { NotificationService } from '../../notifications/notification.service';
import Redis from 'ioredis';
import { TicketsService } from '../../tickets/services/tickets.service';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';

export enum PaymentType {
  DEPOSIT = 'DEPOSIT',
  BALANCE = 'BALANCE',
  FULL = 'FULL',
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly dataSource: DataSource,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @InjectQueue('payments-queue') private readonly paymentsQueue: Queue,
    private readonly ticketsService: TicketsService,
    private readonly auditService: AuditService,
    private readonly notificationService: NotificationService,
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
        // Schedule departure reminders for confirmed reservation
        this.notificationService.scheduleDepartureReminders(reservationId)
          .catch(() => {});
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

  // ============ Initiate (Async with BullMQ mock) ============

  async initiatePayment(dto: InitiatePaymentDto): Promise<{
    payment: Payment;
    instructions: {
      provider: string;
      action: string;
      details?: string;
      expectedDelay: string;
    };
  }> {
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

    // 2. Validate provider-specific requirements
    if ((provider === PaymentProvider.MTN_MOMO || provider === PaymentProvider.ORANGE_MONEY) && !phoneNumber) {
      throw new BadRequestException('Le numéro de téléphone est requis pour le Mobile Money');
    }
    if (provider === PaymentProvider.STRIPE && !stripeToken) {
      throw new BadRequestException('Le token Stripe est requis');
    }
    if (provider === PaymentProvider.CASH) {
      // For CASH, process immediately
      return {
        payment: await this.processPayment({
          reservationId,
          provider,
          paymentMethod: 'cash',
        }),
        instructions: {
          provider: 'CASH',
          action: 'PAY_AT_COUNTER',
          details: 'Veuillez payer au guichet de l\'agence',
          expectedDelay: '0s',
        },
      };
    }

    // 3. Generate a transaction ID
    const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // 4. Create Payment record as PENDING
    const payment = this.paymentRepository.create({
      reservationId,
      amount: reservation.totalAmount,
      provider,
      providerTransactionId: transactionId,
      status: PaymentStatus.PENDING,
      paymentMethod: provider === PaymentProvider.STRIPE ? 'card' : 'mobile_money',
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // 5. Schedule mock processing via BullMQ (2-3s delay)
    const expectedDelay = provider === PaymentProvider.MTN_MOMO ? 3000 : 2000;
    await this.paymentsQueue.add(
      'process-mock-payment',
      {
        paymentId: savedPayment.id,
        reservationId,
        provider,
        amount: reservation.totalAmount,
        phoneNumber,
      },
      { delay: 100, removeOnComplete: true } // Small delay before processing starts
    );

    // 6. Build provider instructions
    const instructions = this.buildProviderInstructions(provider, phoneNumber, expectedDelay);

    return { payment: savedPayment, instructions };
  }

  private buildProviderInstructions(
    provider: PaymentProvider,
    phoneNumber?: string,
    delayMs?: number,
  ) {
    const delaySec = delayMs ? Math.round(delayMs / 1000) : 2;

    switch (provider) {
      case PaymentProvider.MTN_MOMO:
        return {
          provider: 'MTN Mobile Money',
          action: 'USSD_PUSH',
          details: phoneNumber
            ? `Un paiement de ${delaySec}s sera simulé. En production, vous recevrez une demande de paiement MTN MoMo sur le ${phoneNumber}.`
            : `Paiement MTN MoMo simulé (${delaySec}s).`,
          expectedDelay: `${delaySec}s`,
        };
      case PaymentProvider.ORANGE_MONEY:
        return {
          provider: 'Orange Money',
          action: 'USSD_PUSH',
          details: phoneNumber
            ? `Un paiement de ${delaySec}s sera simulé. En production, vous recevrez une demande Orange Money sur le ${phoneNumber}.`
            : `Paiement Orange Money simulé (${delaySec}s).`,
          expectedDelay: `${delaySec}s`,
        };
      case PaymentProvider.STRIPE:
        return {
          provider: 'Stripe',
          action: 'REDIRECT',
          details: 'Redirection vers Stripe Checkout (non implémentée en mode mock). Le paiement sera simulé après 2s.',
          expectedDelay: '2s',
        };
      default:
        return {
          provider,
          action: 'PROCESSING',
          expectedDelay: '2s',
        };
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

    // Cancel pending notifications for cancelled reservation
    this.notificationService.cancelReservationNotifications(payment.reservationId)
      .catch(() => {});

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

  // ============ Fractional Payment: Deposit ============

  async processDeposit(dto: DepositPaymentDto): Promise<{
    payment: Payment;
    reservation: Reservation;
    ticketsGenerated: boolean;
  }> {
    const { reservationId, provider, depositPercentage } = dto;

    // 1. Get Reservation
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['trip', 'trip.route'],
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (reservation.status !== ReservationStatus.PENDING_PAYMENT) {
      throw new BadRequestException('La réservation n\'est pas en attente de paiement');
    }

    // 2. Calculate deposit amount (minimum 30%)
    const pct = Math.max(30, Math.min(100, depositPercentage || 30));
    const depositAmount = Math.round(reservation.totalAmount * pct / 100);
    const remainingAmount = reservation.totalAmount - depositAmount;

    if (depositAmount <= 0) {
      throw new BadRequestException('Le montant de l\'acompte doit être supérieur à 0');
    }

    // 3. Process payment for deposit amount
    let transactionId = `DEPT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    let status = PaymentStatus.SUCCESS;
    let failureReason = null;

    // Mock validation for Mobile Money
    if (provider === PaymentProvider.MTN_MOMO || provider === PaymentProvider.ORANGE_MONEY) {
      if (!dto.phoneNumber) throw new BadRequestException('Le numéro de téléphone est requis pour Mobile Money');
      if (dto.phoneNumber.endsWith('000')) {
        status = PaymentStatus.FAILED;
        failureReason = 'Provision insuffisante (Mock)';
      }
    }

    if (status === PaymentStatus.FAILED) {
      throw new BadRequestException(failureReason);
    }

    // 4. Update Reservation and create Payment in transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = this.paymentRepository.create({
        reservationId,
        amount: depositAmount,
        provider,
        providerTransactionId: transactionId,
        status: PaymentStatus.SUCCESS,
        paymentMethod: provider === PaymentProvider.CASH ? 'cash' : 'mobile_money',
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // Update reservation with deposit info
      reservation.depositPercentage = pct;
      reservation.depositAmount = depositAmount;
      reservation.remainingAmount = remainingAmount;
      reservation.depositPaidAt = new Date();

      if (remainingAmount > 0) {
        // Full payment not yet made — set to PENDING_BALANCE
        reservation.status = ReservationStatus.PENDING_BALANCE;
      } else {
        // Full amount covered by deposit (100%)
        reservation.status = ReservationStatus.CONFIRMED;
      }

      await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      // 5. Generate tickets (after deposit, even if balance is pending)
      //    The ticket will mention the remaining balance due
      let ticketsGenerated = false;
      if (reservation.status === ReservationStatus.CONFIRMED ||
          reservation.status === ReservationStatus.PENDING_BALANCE) {
        await this.ticketsService.generateTicketsForReservation(reservationId)
          .then(() => { ticketsGenerated = true; })
          .catch(() => {});
      }

      // 6. Schedule departure reminders if fully paid (CONFIRMED)
      if (reservation.status === ReservationStatus.CONFIRMED) {
        this.notificationService.scheduleDepartureReminders(reservationId)
          .catch(() => {});
      }

      // Audit
      this.auditService.log({
        userId: reservation.clientId,
        action: 'DEPOSIT_PAID',
        entityType: 'payment',
        entityId: savedPayment.id,
        metadata: {
          reservationId,
          totalAmount: reservation.totalAmount,
          depositAmount,
          remainingAmount,
          depositPercentage: pct,
          provider,
        },
      }).catch(() => {});

      return { payment: savedPayment, reservation, ticketsGenerated };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ============ Fractional Payment: Balance at Counter ============

  async payBalance(reservationId: string, cashierId?: string): Promise<{
    payment: Payment;
    reservation: Reservation;
  }> {
    // 1. Get Reservation
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['trip'],
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (reservation.status !== ReservationStatus.PENDING_BALANCE) {
      throw new BadRequestException('Cette réservation n\'a pas de solde en attente');
    }

    if (!reservation.remainingAmount || reservation.remainingAmount <= 0) {
      throw new BadRequestException('Aucun solde restant dû');
    }

    // 2. Create balance payment
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = this.paymentRepository.create({
        reservationId,
        amount: reservation.remainingAmount,
        provider: PaymentProvider.CASH,
        providerTransactionId: `BAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: PaymentStatus.SUCCESS,
        paymentMethod: 'cash',
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // Mark reservation as fully paid
      reservation.status = ReservationStatus.CONFIRMED;
      reservation.balancePaidAt = new Date();
      reservation.balancePaidBy = cashierId || null;
      reservation.remainingAmount = 0;

      await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      // Schedule departure reminders now that balance is fully paid
      this.notificationService.scheduleDepartureReminders(reservationId)
        .catch(() => {});

      // Audit
      this.auditService.log({
        userId: cashierId,
        action: 'BALANCE_PAID',
        entityType: 'payment',
        entityId: savedPayment.id,
        metadata: {
          reservationId,
          balanceAmount: savedPayment.amount,
          cashierId,
        },
      }).catch(() => {});

      return { payment: savedPayment, reservation };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
          // Schedule departure reminders
          this.notificationService.scheduleDepartureReminders(existingPayment.reservationId)
            .catch(() => {});
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
      this.logger.warn(`Webhook: Paiement inconnu: ${provider} / ${dto.transactionId}`);
    }

    return { received: true };
  }
}
