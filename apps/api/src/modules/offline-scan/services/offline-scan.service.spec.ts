import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfflineScanService } from './offline-scan.service';
import { OfflineScan, OfflineScanStatus } from '../entities/offline-scan.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { AuditService } from '../../audit/services/audit.service';

describe('OfflineScanService', () => {
  let service: OfflineScanService;
  let scanRepository: Repository<OfflineScan>;
  let ticketRepository: Repository<Ticket>;

  const mockTicket = {
    id: 'ticket-1',
    qrPayload: 'payload-123',
    qrSignature: 'sig-456',
    status: 'VALID',
  } as Ticket;

  const mockValidScan = {
    ticketId: 'ticket-1',
    qrPayload: 'payload-123',
    qrSignature: 'sig-456',
  };

  const mockInvalidScan = {
    ticketId: 'ticket-1',
    qrPayload: 'wrong-payload',
    qrSignature: 'wrong-sig',
  };

  const mockOfflineScan = {
    id: 'scan-1',
    ticketId: 'ticket-1',
    qrPayload: 'payload-123',
    qrSignature: 'sig-456',
    status: OfflineScanStatus.VERIFIED,
    scannedAt: new Date(),
  } as OfflineScan;

  const mockScanRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockTicketRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfflineScanService,
        { provide: getRepositoryToken(OfflineScan), useValue: mockScanRepository },
        { provide: getRepositoryToken(Ticket), useValue: mockTicketRepository },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<OfflineScanService>(OfflineScanService);
    scanRepository = module.get<Repository<OfflineScan>>(getRepositoryToken(OfflineScan));
    ticketRepository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should verify a valid offline scan', async () => {
      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockScanRepository.create.mockReturnValue(mockOfflineScan);
      mockScanRepository.save.mockResolvedValue(mockOfflineScan);

      const result = await service.create(mockValidScan, 'controller-1');

      expect(result.status).toBe(OfflineScanStatus.VERIFIED);
      expect(mockTicketRepository.save).toHaveBeenCalled();
    });

    it('should mark scan as invalid if payload mismatch', async () => {
      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockScanRepository.create.mockReturnValue({
        ...mockOfflineScan,
        status: OfflineScanStatus.INVALID,
        qrPayload: 'wrong-payload',
      });
      mockScanRepository.save.mockResolvedValue({
        ...mockOfflineScan,
        status: OfflineScanStatus.INVALID,
      });

      const result = await service.create(mockInvalidScan, 'controller-1');

      expect(result.status).toBe(OfflineScanStatus.INVALID);
    });

    it('should throw if ticket not found', async () => {
      mockTicketRepository.findOne.mockResolvedValue(null);
      await expect(service.create(mockValidScan, 'controller-1')).rejects.toThrow('Ticket non trouvé');
    });
  });

  describe('syncBatch', () => {
    it('should process multiple scans and continue on error', async () => {
      mockTicketRepository.findOne
        .mockResolvedValueOnce(mockTicket)  // First scan succeeds
        .mockResolvedValueOnce(null);       // Second scan fails

      mockScanRepository.create
        .mockReturnValueOnce(mockOfflineScan)
        .mockReturnValueOnce({
          ticketId: 'ticket-2',
          status: OfflineScanStatus.PENDING_VERIFICATION,
          failureReason: 'Ticket non trouvé',
        });

      mockScanRepository.save
        .mockResolvedValueOnce(mockOfflineScan)
        .mockResolvedValueOnce({
          ticketId: 'ticket-2',
          status: OfflineScanStatus.PENDING_VERIFICATION,
          failureReason: 'Ticket non trouvé',
        });

      const result = await service.syncBatch({
        scans: [mockValidScan, { ...mockValidScan, ticketId: 'ticket-2' }],
        deviceId: 'device-1',
      });

      expect(result).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('should return paginated scans', async () => {
      mockScanRepository.findAndCount.mockResolvedValue([[mockOfflineScan], 1]);
      const result = await service.findAll();
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('verifyScan', () => {
    it('should verify a pending scan', async () => {
      mockScanRepository.findOne.mockResolvedValue({
        ...mockOfflineScan,
        status: OfflineScanStatus.PENDING_VERIFICATION,
      });
      mockScanRepository.save.mockResolvedValue({
        ...mockOfflineScan,
        status: OfflineScanStatus.VERIFIED,
      });

      const result = await service.verifyScan('scan-1', 'verifier-1');
      expect(result.status).toBe(OfflineScanStatus.VERIFIED);
    });
  });
});
