import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/subscriptions.entity';
import { InvoiceStatus, SubscriptionStatus } from '@opep/shared-types';
import { AuditService } from '../../audit/services/audit.service';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class BillingsService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly auditService: AuditService,
  ) {}

  async createInvoice(
    companyId: string,
    subscriptionId: string,
    amount: number,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      companyId,
      subscriptionId,
      amount,
      periodStart,
      periodEnd,
      status: InvoiceStatus.UNPAID,
    });
    return this.invoiceRepository.save(invoice);
  }

  async findByCompany(
    companyId: string,
    paginationDto: PaginationDto,
  ): Promise<{ items: Invoice[]; total: number }> {
    return this.invoiceRepository.findAndCount({
      where: { companyId },
      order: { issuedAt: 'DESC' },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    }).then(([items, total]) => ({ items, total }));
  }

  async findAll(paginationDto: PaginationDto): Promise<{ items: Invoice[]; total: number }> {
    return this.invoiceRepository.findAndCount({
      relations: ['company'],
      order: { issuedAt: 'DESC' },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    }).then(([items, total]) => ({ items, total }));
  }

  async markAsPaid(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException('Facture non trouvée');

    invoice.status = InvoiceStatus.PAID;
    invoice.paidAt = new Date();
    return this.invoiceRepository.save(invoice);
  }

  // === CRON JOBS ===

  /**
   * Daily cron: check all TRIALING subscriptions whose endDate is past due
   * and mark them as PAST_DUE, notifying the DG.
   */
  async checkTrialExpirations(): Promise<number> {
    const now = new Date();
    const expiredTrials = await this.subscriptionRepository.find({
      where: {
        planName: 'FREE_TRIAL',
        status: SubscriptionStatus.TRIALING,
      },
    });

    let expiredCount = 0;
    for (const sub of expiredTrials) {
      if (sub.endDate && sub.endDate < now) {
        sub.status = SubscriptionStatus.PAST_DUE;
        await this.subscriptionRepository.save(sub);

        this.auditService.log({
          action: 'TRIAL_EXPIRED',
          entityType: 'subscription',
          entityId: sub.id,
          metadata: { companyId: sub.companyId, expiredAt: now },
        }).catch(() => {});

        expiredCount++;
      }
    }
    return expiredCount;
  }

  /**
   * Monthly cron: generate new UNPAID invoices for all ACTIVE subscriptions
   * that are not FREE_TRIAL.
   */
  async generateMonthlyInvoices(): Promise<number> {
    const now = new Date();
    const activeSubs = await this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    let generatedCount = 0;
    for (const sub of activeSubs) {
      if (sub.planName === 'FREE_TRIAL') continue;

      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Check no invoice already exists for this period
      const existing = await this.invoiceRepository.findOne({
        where: {
          subscriptionId: sub.id,
          periodStart: MoreThan(periodStart),
        },
      });
      if (existing) continue;

      const company = await this.companyRepository.findOne({
        where: { id: sub.companyId },
      });

      if (company) {
        await this.createInvoice(
          company.id,
          sub.id,
          sub.price,
          periodStart,
          periodEnd,
        );
        generatedCount++;
      }
    }
    return generatedCount;
  }
}
