import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuditService } from '../../audit/services/audit.service';
import { TicketsService } from '../../tickets/services/tickets.service';
import { NotificationService } from '../../notifications/notification.service';
import { Payment, PaymentProvider } from '../entities/payment.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';

const mockPaymentsQueue = {
  add: jest.fn().mockResolvedValue({ id: 'mock-job-1' }),
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let auditService: AuditService;
  let ticketsService: TicketsService;

  const baseReservation: Partial<Reservation> = {
    id: 'res-1',
    clientId: 'user-42',
    status: ReservationStatus.PENDING_PAYMENT,
    totalAmount: 12000,
  };

  const fakeQueryRunner: any = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: {
      save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    },
  };

  const mockRepository = (): any => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn().mockImplementation((data) => ({ id: 'pay-1', ...data })),
    save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
  });

  const mockDataSource = (): any => ({
    createQueryRunner: jest.fn().mockReturnValue(fakeQueryRunner),
  });

  const mockTicketService = () => ({
    generateTicketsForReservation: jest.fn().mockResolvedValue([]),
  });

  const mockAuditService = () => ({
    log: jest.fn().mockResolvedValue(undefined),
  });

  const mockNotificationService = () => ({
    scheduleDepartureReminders: jest.fn().mockResolvedValue(undefined),
    cancelReservationNotifications: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: ConfigService, useFactory: () => ({ get: jest.fn((key: string, def?: any) => def) }) },
        { provide: DataSource, useFactory: mockDataSource },
        { provide: 'PaymentRepository', useFactory: mockRepository },
        { provide: 'ReservationRepository', useFactory: mockRepository },
        { provide: TicketsService, useFactory: mockTicketService },
        { provide: AuditService, useFactory: mockAuditService },
        { provide: NotificationService, useFactory: mockNotificationService },
        { provide: REDIS_CLIENT, useValue: { on: jest.fn(), quit: jest.fn(), set: jest.fn(), get: jest.fn() } },
        { provide: 'BullQueue_payments-queue', useValue: mockPaymentsQueue },
      ],
    }).compile();

    const reservationRepo = module.get('ReservationRepository') as jest.Mocked<Repository<Reservation>>;
    const paymentRepo = module.get('PaymentRepository') as jest.Mocked<Repository<Payment>>;
    baseReservation.status = ReservationStatus.PENDING_PAYMENT;
    reservationRepo.findOne.mockResolvedValue({ ...baseReservation } as Reservation);

    service = new PaymentsService(
      paymentRepo,
      reservationRepo,
      module.get(DataSource),
      module.get(REDIS_CLIENT),
      module.get('BullQueue_payments-queue'),
      module.get(TicketsService),
      module.get(AuditService),
      module.get(NotificationService),
    );

    auditService = module.get(AuditService);
    ticketsService = module.get(TicketsService);
  });

  it('processes a successful payment and emits PAYMENT_PROCESSED audit log with userId', async () => {
    const result = await service.processPayment({
      reservationId: 'res-1',
      provider: PaymentProvider.MTN_MOMO,
      phoneNumber: '670000001',
    });

    expect(result.id).toBe('pay-1');
    expect(auditService.log).toHaveBeenCalledTimes(1);
    const [auditArg] = (auditService.log as jest.Mock).mock.calls[0];
    expect(auditArg).toEqual(
      expect.objectContaining({
        userId: 'user-42',
        action: 'PAYMENT_PROCESSED',
        entityType: 'payment',
        metadata: expect.objectContaining({ reservationId: 'res-1', amount: 12000 }),
      }),
    );
    expect(ticketsService.generateTicketsForReservation).toHaveBeenCalledWith('res-1');
    expect(fakeQueryRunner.commitTransaction).toHaveBeenCalled();
  });

  it('logs PAYMENT_FAILED audit when mock mobile money fails (phone ending with 000)', async () => {
    await service.processPayment({
      reservationId: 'res-1',
      provider: PaymentProvider.ORANGE_MONEY,
      phoneNumber: '670000000',
    });

    expect(auditService.log).toHaveBeenCalledTimes(1);
    const auditArg = (auditService.log as jest.Mock).mock.calls[0][0];
    expect(auditArg.action).toBe('PAYMENT_FAILED');
    expect(auditArg.userId).toBe('user-42');
    expect(auditArg.metadata.failureReason).toMatch(/Provision/);
    expect(ticketsService.generateTicketsForReservation).not.toHaveBeenCalled();
  });

  it('throws NotFound when reservation is missing', async () => {
    const reservationRepo = (service as any).reservationRepository;
    reservationRepo.findOne.mockResolvedValue(null);
    await expect(
      service.processPayment({
        reservationId: 'ghost',
        provider: PaymentProvider.STRIPE,
        stripeToken: 'tok_visa',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequest when reservation is not in PENDING_PAYMENT', async () => {
    const reservationRepo = (service as any).reservationRepository;
    reservationRepo.findOne.mockResolvedValue({ ...baseReservation, status: ReservationStatus.CONFIRMED } as Reservation);
    await expect(
      service.processPayment({
        reservationId: 'res-1',
        provider: PaymentProvider.STRIPE,
        stripeToken: 'tok_visa',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
