import { Test } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { AuditService } from '../audit/services/audit.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let auditService: AuditService;

  const makeLog = (overrides: Partial<any> = {}) => ({
    id: 'log-1',
    action: 'RESERVATION_CREATED',
    entityType: 'reservation',
    entityId: 'r-1',
    metadata: { seatsCount: 2, totalAmount: 12000 },
    createdAt: new Date('2026-06-30T10:00:00Z'),
    ...overrides,
  });

  const mockAuditService = {
    log: jest.fn(),
    getUserAudit: jest.fn(),
    getEntityAudit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: AuditService, useValue: mockAuditService }],
    }).compile();
    controller = module.get(NotificationsController);
    auditService = module.get(AuditService);
  });

  it('GET /notifications/my transforms each audit log into a notification', async () => {
    mockAuditService.getUserAudit.mockResolvedValue([
      makeLog(),
      makeLog({
        id: 'log-2',
        action: 'PAYMENT_PROCESSED',
        metadata: { amount: 15000 },
      }),
      makeLog({
        id: 'log-3',
        action: 'PAYMENT_FAILED',
        metadata: { amount: 9000, failureReason: 'Insuffisant' },
      }),
      makeLog({ id: 'log-4', action: 'TICKET_SCANNED' }),
      makeLog({ id: 'log-5', action: 'TICKETS_GENERATED' }),
      makeLog({ id: 'log-6', action: 'TICKET_VALIDATION_FAILED' }),
    ]);

    const result = await controller.getMyNotifications('user-1');

    expect(auditService.getUserAudit).toHaveBeenCalledWith('user-1');
    expect(result).toHaveLength(6);
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: 'Réservation créée',
        type: 'SUCCESS',
        message: expect.stringContaining('place(s)'),
      }),
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        title: 'Paiement effectué',
        type: 'SUCCESS',
        message: expect.stringContaining('15000 FCFA'),
      }),
    );
    expect(result[2].title).toBe('Paiement échoué');
    expect(result[2].type).toBe('WARNING');
    expect(result[2].message).toEqual(expect.stringContaining('9000 FCFA'));
    expect(result[2].message).toEqual(expect.stringContaining('Insuffisant'));
    expect(result[3].type).toBe('INFO');
    expect(result[4].type).toBe('INFO');
    expect(result[5]).toEqual(
      expect.objectContaining({ title: 'Validation échouée', type: 'WARNING' }),
    );
  });

  it('falls back to a generic notification for unknown actions', async () => {
    mockAuditService.getUserAudit.mockResolvedValue([
      makeLog({ id: 'log-7', action: 'SOMETHING_CUSTOM' }),
    ]);
    const result = await controller.getMyNotifications('user-2');
    expect(result[0]).toEqual(
      expect.objectContaining({ title: 'Notification', type: 'INFO', message: 'SOMETHING_CUSTOM' }),
    );
  });

  it('returns an empty array when the user has no audit logs', async () => {
    mockAuditService.getUserAudit.mockResolvedValue([]);
    const result = await controller.getMyNotifications('new-user');
    expect(result).toEqual([]);
  });
});
