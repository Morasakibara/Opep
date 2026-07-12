import { Controller, Get, Post, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BillingsService } from './services/billings.service';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { UserRole } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseGuards(OwnershipGuard, SubscriptionGuard)
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) {}

  @Get('invoices')
  @Roles(UserRole.ADMIN_PLATFORM)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.billingsService.findAll(paginationDto);
    return paginate(items.map(InvoiceResponseDto.fromEntity), total, paginationDto);
  }

  @Get('invoices/company/:companyId')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  async findByCompany(
    @Param('companyId') companyId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const { items, total } = await this.billingsService.findByCompany(companyId, paginationDto);
    return paginate(items.map(InvoiceResponseDto.fromEntity), total, paginationDto);
  }

  @Patch('invoices/:id/mark-paid')
  @Roles(UserRole.ADMIN_PLATFORM)
  async markAsPaid(@Param('id') id: string) {
    const invoice = await this.billingsService.markAsPaid(id);
    return InvoiceResponseDto.fromEntity(invoice);
  }

  // Admin-only cron trigger endpoints
  @Post('cron/check-trials')
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 2, ttl: 60000 } })
  async checkTrials() {
    const count = await this.billingsService.checkTrialExpirations();
    return { message: `${count} essai(s) expiré(s) traité(s)`, count };
  }

  @Post('cron/generate-invoices')
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 2, ttl: 60000 } })
  async generateInvoices() {
    const count = await this.billingsService.generateMonthlyInvoices();
    return { message: `${count} facture(s) générée(s)`, count };
  }
}
