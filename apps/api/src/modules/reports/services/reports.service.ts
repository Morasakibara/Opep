import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { Payment, PaymentStatus } from '../../payments/entities/payment.entity';
import { Trip, TripStatus } from '../../trips/entities/trip.entity';
import { Ticket, TicketStatus } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { Centre } from '../../centres/entities/centre.entity';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Centre)
    private readonly centreRepo: Repository<Centre>,
  ) {}

  async getDashboardStats(scope?: { agencyId?: string; companyId?: string; centreId?: string }) {
    // Construit le filtre selon le scope utilisateur
    // Priorité : centreId > companyId (via centres) > agencyId (legacy)
    const whereClause: any = {};
    if (scope?.centreId) {
      whereClause.centreId = scope.centreId;
    } else if (scope?.companyId) {
      // Pour companyId, filtre par tous les centres de la compagnie
      const centres = await this.centreRepo.find({
        where: { companyId: scope.companyId, isActive: true },
        select: ['id'],
      });
      if (centres.length > 0) {
        whereClause.centreId = centres.map(c => c.id);
      } else {
        // Pas de centre actif → aucun résultat (évite SQL IN vide)
        whereClause.centreId = '00000000-0000-0000-0000-000000000000';
      }
    } else if (scope?.agencyId) {
      whereClause.agencyId = scope.agencyId;
    }

    const [
      totalReservations,
      totalRevenue,
      activeTrips,
      totalTickets,
      totalUsers,
      totalCompanies,
    ] = await Promise.all([
      this.reservationRepo.count({ where: { ...whereClause } }),
      this.paymentRepo
        .createQueryBuilder('payment')
        .select('COALESCE(SUM(payment.amount), 0)', 'total')
        .where('payment.status = :status', { status: PaymentStatus.SUCCESS })
        .getRawOne()
        .then(r => parseInt(r.total, 10)),
      this.tripRepo.count({ where: { status: TripStatus.IN_PROGRESS } }),
      this.ticketRepo.count(),
      this.userRepo.count(),
      this.companyRepo.count(),
    ]);

    return {
      totalReservations,
      totalRevenue,
      activeTrips,
      totalTickets,
      totalUsers,
      totalCompanies,
      revenueFormatted: `${(totalRevenue / 1_000_000).toFixed(1)}M FCFA`,
    };
  }

  async getRevenueData(period: string = '6months') {
    const months = period === '12months' ? 12 : 6;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const payments = await this.paymentRepo
      .createQueryBuilder('payment')
      .select("DATE_TRUNC('month', payment.createdAt)", 'month')
      .addSelect('COALESCE(SUM(payment.amount), 0)', 'total')
      .where('payment.status = :status', { status: PaymentStatus.SUCCESS })
      .andWhere('payment.createdAt >= :startDate', { startDate })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    // Fill in missing months with 0
    const result = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
      const monthLabel = monthNames[d.getMonth()];
      const found = payments.find(
        (p: any) => new Date(p.month).getMonth() === d.getMonth()
      );
      result.push({
        name: monthLabel,
        value: found ? Math.round(parseInt(found.total, 10) / 1_000_000) : 0,
      });
    }

    return result;
  }

  async getHealthStatus() {
    try {
      // Basic health checks
      const [userCount, reservationCount, recentPaymentCount] = await Promise.all([
        this.userRepo.count(),
        this.reservationRepo.count({ where: { status: ReservationStatus.CONFIRMED } }),
        this.paymentRepo
          .createQueryBuilder('payment')
          .where('payment.createdAt >= :since', { since: new Date(Date.now() - 60 * 60 * 1000) })
          .getCount(),
      ]);

      return {
        status: 'healthy',
        uptime: process.uptime(),
        metrics: {
          totalUsers: userCount,
          confirmedReservations: reservationCount,
          paymentsLastHour: recentPaymentCount,
        },
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
