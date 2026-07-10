import { Test } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TicketsService } from './tickets.service';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { Passenger } from '../../reservations/entities/passenger.entity';
import { AuditService } from '../../audit/services/audit.service';

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
}));

describe('TicketsService', () => {
  let service: TicketsService;

  const mockTicket = {
    id: 'ticket-1',
    passengerId: 'p-1',
    reservationId: 'res-1',
    qrPayload: 'payload-data',
    qrSignature: 'signature-data',
    status: TicketStatus.VALID,
    issuedAt: new Date(),
    validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
    scannedAt: null,
    scannedBy: null,
    scannedOffline: false,
    passenger: { id: 'p-1', firstName: 'Fatou', lastName: 'Diop', seatNumber: 5 },
    reservation: {
      id: 'res-1',
      clientId: 'client-1',
      reservationCode: 'OP-ABC123',
      trip: {
        id: 't-1',
        departureDateTime: new Date(),
        route: { departureCity: 'Dakar', arrivalCity: 'Thies' },
      },
    },
  };

  const mockRepository = (): any => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn().mockImplementation((data) => data),
    save: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, id: 'ticket-1' })),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  });

  const mockAuditService = () => ({
    log: jest.fn().mockResolvedValue(undefined),
  });

  const mockConfigService = () => ({
    get: jest.fn((key: string) => {
      if (key === 'RSA_PRIVATE_KEY') return 'mock-private-key';
      if (key === 'RSA_PUBLIC_KEY') return 'mock-public-key';
      return null;
    }),
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Ticket), useFactory: mockRepository },
        { provide: getRepositoryToken(Reservation), useFactory: mockRepository },
        { provide: getRepositoryToken(Passenger), useFactory: mockRepository },
        { provide: ConfigService, useFactory: mockConfigService },
        { provide: AuditService, useFactory: mockAuditService },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  describe('generateTicketsForReservation', () => {
    it('throws NotFoundException when reservation does not exist', async () => {
      const resRepo = (service as any).reservationRepository;
      resRepo.findOne.mockResolvedValue(null);

      await expect(service.generateTicketsForReservation('ghost')).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when reservation is not confirmed', async () => {
      const resRepo = (service as any).reservationRepository;
      resRepo.findOne.mockResolvedValue({
        id: 'res-1',
        status: ReservationStatus.PENDING_PAYMENT,
        trip: {},
        agency: {},
      });

      await expect(service.generateTicketsForReservation('res-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTicket', () => {
    it('returns a ticket when found', async () => {
      const ticketRepo = (service as any).ticketRepository;
      ticketRepo.findOne.mockResolvedValue(mockTicket);

      const result = await service.getTicket('ticket-1');
      expect(result.id).toBe('ticket-1');
    });

    it('throws NotFoundException when ticket is missing', async () => {
      const ticketRepo = (service as any).ticketRepository;
      ticketRepo.findOne.mockResolvedValue(null);

      await expect(service.getTicket('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateAndScan', () => {
    it('returns failure when public key is missing', async () => {
      // Override publicKey by setting it directly
      Object.defineProperty(service, 'publicKey', { value: null, writable: true });

      const result = await service.validateAndScan('some-qr-string');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('cle publique');
    });
  });
});
