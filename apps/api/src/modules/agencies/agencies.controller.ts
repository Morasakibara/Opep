import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AgenciesService } from './services/agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { AgencyResponseDto } from './dto/agency-response.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('agencies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async create(@Body() createAgencyDto: CreateAgencyDto) {
    const agency = await this.agenciesService.create(createAgencyDto);
    return AgencyResponseDto.fromEntity(agency);
  }

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.agenciesService.findAll(paginationDto);
    return paginate(items.map(AgencyResponseDto.fromEntity), total, paginationDto);
  }

  @Get(':id')
  @UseGuards(OwnershipGuard)
  async findOne(@Param('id') id: string) {
    const agency = await this.agenciesService.findOne(id);
    return AgencyResponseDto.fromEntity(agency);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  @UseGuards(OwnershipGuard)
  async getStats(@Param('id') id: string) {
    return this.agenciesService.getAgencyStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  @UseGuards(OwnershipGuard)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async update(@Param('id') id: string, @Body() updateAgencyDto: any) {
    const agency = await this.agenciesService.update(id, updateAgencyDto);
    return AgencyResponseDto.fromEntity(agency);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async remove(@Param('id') id: string) {
    await this.agenciesService.remove(id);
    return { message: 'Agence supprimée avec succès' };
  }
}
