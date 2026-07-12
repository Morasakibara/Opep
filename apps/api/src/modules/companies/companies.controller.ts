import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CompaniesService } from './services/companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyResponseDto } from './dto/company-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { UserRole } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard, SubscriptionGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async create(@Body() dto: CreateCompanyDto) {
    const company = await this.companiesService.create(dto);
    return CompanyResponseDto.fromEntity(company);
  }

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.companiesService.findAll(paginationDto);
    return paginate(items.map(CompanyResponseDto.fromEntity), total, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findOne(id);
    return CompanyResponseDto.fromEntity(company);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  async getStats(@Param('id') id: string) {
    return this.companiesService.getStats(id);
  }

  @Get(':id/centres')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  async getCentres(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async update(@Param('id') id: string, @Body() data: any) {
    const company = await this.companiesService.update(id, data);
    return CompanyResponseDto.fromEntity(company);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async remove(@Param('id') id: string) {
    await this.companiesService.remove(id);
    return { message: 'Compagnie désactivée avec succès' };
  }

  @Post(':id/assign-director')
  @Roles(UserRole.ADMIN_PLATFORM)
  async assignDirector(@Param('id') id: string, @Body('userId') userId: string) {
    await this.companiesService.assignDirector(id, userId);
    return { message: 'Directeur assigné avec succès' };
  }
}
