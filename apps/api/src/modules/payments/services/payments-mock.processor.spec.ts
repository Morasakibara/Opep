import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentsMockProcessor } from './payments-mock.processor';
import { Payment, PaymentProvider, PaymentStatus } from '../entities/payment.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { TicketsService } from '../../tickets/services/tickets.service';
import { AuditService } from '../../audit/services/audit.service';

const mockPayment = {
  id: 'pay-1',
  reservationId: 'res-1',
  amount: 5000,
  provider: PaymentProvider.MTN_MOMO,
  status: PaymentStatus.PENDING,
  metadata: {},
};

const mockReservation = {
  id: 'res-1',
  status: ReservationStatus.PENDING_PAYMENT,
};

describe('PaymentsMockProcessor', () => {
  let processor: PaymentsMockProcessor;
  let paymentRepo: any;
  let reservationRepo: any;
  let ticketsService: any;
  let auditService: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    paymentRepo = {
      findOne: jest.fn(),
      save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    };

    reservationRepo = {
      findOne: jest.fn(),
      save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    };

    ticketsService = {
      generateTicketsForReservation: jest.fn().mockResolvedValue([]),
    };

    auditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    const module = await Test.createTestingModule({
      providers: [
        PaymentsMockProcessor,
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
        { provide: getRepositoryToken(Reservation), useValue: reservationRepo },
        { provide: TicketsService, useValue: ticketsService },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    processor = module.get<PaymentsMockProcessor>(PaymentsMockProcessor);
  });

  describe('process mock payment', () => {
    it('marks payment as SUCCESS and confirms reservation for successful mock', async () => {
      paymentRepo.findOne.mockResolvedValue({ ...mockPayment });
      reservationRepo.findOne.mockResolvedValue({ ...mockReservation });

      const job = {
        data: {
          paymentId: 'pay-1',
          reservationId: 'res-1',
          provider: PaymentProvider.ORANGE_MONEY,
          amount: 5000,
          phoneNumber: '670000001',
        },
      } as any;

      jest.useFakeTimers();
      const promise = processor.process(job);
      jest.advanceTimersByTime(3000);
      const result = await promise;

      expect(result.status).toBe('SUCCESS');
      expect(paymentRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: PaymentStatus.SUCCESS }),
      );
      expect(reservationRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: ReservationStatus.CONFIRMED }),
      );
      expect(ticketsService.generateTicketsForReservation).toHaveBeenCalledWith('res-1');
      expect(auditService.log).toHaveBeenCalled();
    });

    it('marks payment as FAILED when phone ends with 000', async () => {
      paymentRepo.findOne.mockResolvedValue({ ...mockPayment });

      const job = {
        data: {
          paymentId: 'pay-1',
          reservationId: 'res-1',
          provider: PaymentProvider.MTN_MOMO,
          amount: 5000,
          phoneNumber: '670000000',
        },
      } as any;

      jest.useFakeTimers();
      const promise = processor.process(job);
      jest.advanceTimersByTime(3000);
      const result = await promise;

      expect(result.status).toBe('FAILED');
      expect(paymentRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: PaymentStatus.FAILED,
          failureReason: expect.stringContaining('Mock'),
        }),
      );
      expect(ticketsService.generateTicketsForReservation).not.toHaveBeenCalled();
    });

    it('does nothing if payment is already processed', async () => {
      paymentRepo.findOne.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.SUCCESS,
      });

      const job = {
        data: { paymentId: 'pay-1', reservationId: 'res-1', provider: PaymentProvider.MTN_MOMO, amount: 5000 },
      } as any;

      jest.useFakeTimers();
      const promise = processor.process(job);
      jest.advanceTimersByTime(3000);
      await promise;

      expect(paymentRepo.save).not.toHaveBeenCalled();
    });

    it('returns not found when payment does not exist', async () => {
      paymentRepo.findOne.mockResolvedValue(null);

      const job = {
        data: { paymentId: 'ghost', reservationId: 'res-1', provider: PaymentProvider.MTN_MOMO, amount: 5000 },
      } as any;

      jest.useFakeTimers();
      const promise = processor.process(job);
      jest.advanceTimersByTime(3000);
      const result = await promise;
      expect(result.received).toBe(false);
      expect(result.reason).toContain('not found');
    });
  });
});
