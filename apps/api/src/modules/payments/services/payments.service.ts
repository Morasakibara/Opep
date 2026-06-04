import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentProvider, PaymentStatus } from '../entities/payment.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { TicketsService } from '../../tickets/services/tickets.service';

@Injectable()
export class PaymentsService {
  private redis: Redis;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly ticketsService: TicketsService,
  ) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

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
}
