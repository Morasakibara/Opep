import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { ReportsService } from './services/reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.COMPANY_DIRECTOR, UserRole.CENTRE_MANAGER)
  async getDashboardStats(@Req() req: any) {
    const user = req.user;
    // Détermine le scope des stats selon le rôle
    let scope: { agencyId?: string; companyId?: string; centreId?: string } | undefined;
    if (user?.role !== UserRole.ADMIN_PLATFORM) {
      scope = {
        agencyId: user?.agencyId,
        companyId: user?.companyId,
        centreId: user?.centreId,
      };
    }
    return this.reportsService.getDashboardStats(scope);
  }

  @Get('revenue')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  async getRevenueData(@Query('period') period: string = '6months') {
    return this.reportsService.getRevenueData(period);
  }

  @Get('health')
  @Roles(UserRole.ADMIN_PLATFORM)
  async getHealthStatus() {
    return this.reportsService.getHealthStatus();
  }
}
