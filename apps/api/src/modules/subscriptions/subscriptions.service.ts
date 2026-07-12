import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscriptions.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getPackages() {
    return [
      { id: 'starter', name: 'Starter Plan', price: 25000, features: ['Upto 5 Buses', 'Basic Reports'] },
      { id: 'premium', name: 'Premium Plan', price: 75000, features: ['Upto 30 Buses', 'Advanced Reports', 'Offline Sync'] },
      { id: 'enterprise', name: 'Enterprise Plan', price: 150000, features: ['Unlimited Buses', 'Custom API', '24/7 Support'] },
    ];
  }

  async subscribe(companyId: string, planId: string): Promise<Subscription> {
    const packages = await this.getPackages();
    const pkg = packages.find(p => p.id === planId);
    if (!pkg) throw new NotFoundException('Plan non trouvé');

    const company = await this.companyRepository.findOneBy({ id: companyId });
    if (!company) throw new NotFoundException('Compagnie non trouvée');

    const subscription = this.subscriptionRepository.create({
      planName: pkg.name,
      price: pkg.price,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      company: { id: companyId } as any
    });

    return this.subscriptionRepository.save(subscription);
  }

  async getStatus(companyId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { company: { id: companyId } },
      order: { createdAt: 'DESC' }
    });
  }
}