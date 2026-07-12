import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingsService } from './billings.service';
import { Invoice } from '../entities/invoice.entity';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/subscriptions.entity';
import { AuditService } from '../../audit/services/audit.service';
import { InvoiceStatus, SubscriptionStatus } from '@opep/shared-types';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('BillingsService', () => {
  let service: BillingsService;
  let invoiceRepo: Repository<Invoice>;
  let companyRepo: Repository<Company>;
  let subscriptionRepo: Repository<Subscription>;

  const mockInvoice = {
    id: 'inv-1',
    companyId: 'comp-1',
    subscriptionId: 'sub-1',
    amount: 25000,
    periodStart: new Date('2026-01-01'),
    periodEnd: new Date('2026-01-31'),
    status: InvoiceStatus.UNPAID,
    issuedAt: new Date(),
    paidAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Invoice;

  const mockCompany = {
    id: 'comp-1',
    name: 'OPEP Express',
    isActive: true,
  } as Company;

  const mockSubscription = {
    id: 'sub-1',
    companyId: 'comp-1',
    planName: 'PREMIUM',
    price: 25000,
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  } as Subscription;

  const mockInvoiceRepo = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockCompanyRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockSubscriptionRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        BillingsService,
        { provide: getRepositoryToken(Invoice), useValue: mockInvoiceRepo },
        { provide: getRepositoryToken(Company), useValue: mockCompanyRepo },
        { provide: getRepositoryToken(Subscription), useValue: mockSubscriptionRepo },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();
    service = module.get<BillingsService>(BillingsService);
    invoiceRepo = module.get(getRepositoryToken(Invoice));
    companyRepo = module.get(getRepositoryToken(Company));
    subscriptionRepo = module.get(getRepositoryToken(Subscription));
  });

  describe('createInvoice', () => {
    it('creates an unpaid invoice', async () => {
      mockInvoiceRepo.create.mockReturnValue(mockInvoice);
      mockInvoiceRepo.save.mockResolvedValue(mockInvoice);

      const result = await service.createInvoice(
        'comp-1',
        'sub-1',
        25000,
        new Date('2026-01-01'),
        new Date('2026-01-31'),
      );

      expect(result.id).toBe('inv-1');
      expect(result.status).toBe(InvoiceStatus.UNPAID);
      expect(mockInvoiceRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: 'comp-1',
          amount: 25000,
          status: InvoiceStatus.UNPAID,
        }),
      );
    });
  });

  describe('findByCompany', () => {
    it('returns paginated invoices for a company', async () => {
      mockInvoiceRepo.findAndCount.mockResolvedValue([[mockInvoice], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findByCompany('comp-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findAll', () => {
    it('returns paginated invoices with company relation', async () => {
      mockInvoiceRepo.findAndCount.mockResolvedValue([[mockInvoice], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAll(paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('markAsPaid', () => {
    it('marks an invoice as paid', async () => {
      mockInvoiceRepo.findOne.mockResolvedValue(mockInvoice);
      mockInvoiceRepo.save.mockResolvedValue({
        ...mockInvoice,
        status: InvoiceStatus.PAID,
        paidAt: new Date(),
      });

      const result = await service.markAsPaid('inv-1');
      expect(result.status).toBe(InvoiceStatus.PAID);
      expect(result.paidAt).toBeDefined();
    });

    it('throws NotFoundException when invoice is missing', async () => {
      mockInvoiceRepo.findOne.mockResolvedValue(null);
      await expect(service.markAsPaid('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkTrialExpirations', () => {
    it('expires trialing subscriptions past their endDate', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      const expiredSub = {
        ...mockSubscription,
        status: SubscriptionStatus.TRIALING,
        planName: 'FREE_TRIAL',
        endDate: pastDate,
      };
      mockSubscriptionRepo.find.mockResolvedValue([expiredSub]);
      mockSubscriptionRepo.save.mockResolvedValue({
        ...expiredSub,
        status: SubscriptionStatus.PAST_DUE,
      });

      const count = await service.checkTrialExpirations();
      expect(count).toBe(1);
      expect(mockSubscriptionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: SubscriptionStatus.PAST_DUE }),
      );
    });

    it('does not expire subscriptions with future endDate', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      const activeTrial = {
        ...mockSubscription,
        status: SubscriptionStatus.TRIALING,
        planName: 'FREE_TRIAL',
        endDate: futureDate,
      };
      mockSubscriptionRepo.find.mockResolvedValue([activeTrial]);

      const count = await service.checkTrialExpirations();
      expect(count).toBe(0);
      expect(mockSubscriptionRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('generateMonthlyInvoices', () => {
    it('generates invoices for active subscriptions', async () => {
      mockSubscriptionRepo.find.mockResolvedValue([mockSubscription]);
      mockInvoiceRepo.findOne.mockResolvedValue(null);
      mockCompanyRepo.findOne.mockResolvedValue(mockCompany);
      mockInvoiceRepo.create.mockReturnValue(mockInvoice);
      mockInvoiceRepo.save.mockResolvedValue(mockInvoice);

      const count = await service.generateMonthlyInvoices();
      expect(count).toBe(1);
    });

    it('skips FREE_TRIAL subscriptions', async () => {
      const freeTrialSub = { ...mockSubscription, planName: 'FREE_TRIAL' };
      mockSubscriptionRepo.find.mockResolvedValue([freeTrialSub]);

      const count = await service.generateMonthlyInvoices();
      expect(count).toBe(0);
    });

    it('skips subscriptions that already have an invoice for the period', async () => {
      mockSubscriptionRepo.find.mockResolvedValue([mockSubscription]);
      mockInvoiceRepo.findOne.mockResolvedValue(mockInvoice); // Existing invoice found

      const count = await service.generateMonthlyInvoices();
      expect(count).toBe(0);
    });
  });
});
