import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { Subscription } from './subscriptions.entity';
import { Invoice } from '../billings/entities/invoice.entity';
import { Company } from '../companies/entities/company.entity';

@Processor('subscriptions-queue')
export class SubscriptionsProcessor extends WorkerHost {
  private readonly logger = new Logger(SubscriptionsProcessor.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'check-trial-expiration') {
      return this.checkTrialExpirations();
    }
    if (job.name === 'generate-monthly-invoices') {
      return this.generateMonthlyInvoices();
    }
    this.logger.warn(`Job inconnu : ${job.name}`);
  }

  /**
   * Vérifie les abonnements TRIALING dont la période d'essai est expirée
   * et les passe à PAST_DUE.
   */
  private async checkTrialExpirations() {
    const now = new Date();
    const expiredTrials = await this.subscriptionRepository.find({
      where: {
        status: 'TRIALING',
        endDate: LessThan(now),
      },
      relations: ['company'],
    });

    this.logger.log(`${expiredTrials.length} essais gratuits expirés détectés`);

    for (const sub of expiredTrials) {
      sub.status = 'PAST_DUE';
      await this.subscriptionRepository.save(sub);
      this.logger.log(`Abonnement ${sub.id} (${sub.company?.name}) passé à PAST_DUE`);
    }

    return { processed: expiredTrials.length };
  }

  /**
   * Génère les factures mensuelles pour tous les abonnements actifs.
   */
  private async generateMonthlyInvoices() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const activeSubscriptions = await this.subscriptionRepository.find({
      where: [
        { status: 'ACTIVE' },
        { status: 'TRIALING' },
      ],
      relations: ['company'],
    });

    let generated = 0;

    for (const sub of activeSubscriptions) {
      // Skip trial subscriptions (invoicing only for paid plans)
      if (sub.status === 'TRIALING' || sub.planName === 'FREE_TRIAL') continue;

      // Check if invoice already exists for this period
      const existing = await this.invoiceRepository.findOne({
        where: {
          subscriptionId: sub.id,
          periodStart: startOfMonth,
        },
      });

      if (existing) continue;

      const invoice = this.invoiceRepository.create({
        companyId: sub.companyId,
        subscriptionId: sub.id,
        periodStart: startOfMonth,
        periodEnd: endOfMonth,
        amount: sub.price || 0,
        status: 'UNPAID' as any,
        issuedAt: now,
      });

      await this.invoiceRepository.save(invoice);
      generated++;
      this.logger.log(`Facture générée pour ${sub.company?.name}: ${sub.price} FCFA`);
    }

    this.logger.log(`${generated} factures générées`);
    return { generated };
  }
}
