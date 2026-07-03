import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AgenciesService } from './services/agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AgencyOwnershipGuard } from '../auth/guards/agency-ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { AgencyResponseDto } from './dto/agency-response.dto';

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
  async findAll() {
    const agencies = await this.agenciesService.findAll();
    return agencies.map(AgencyResponseDto.fromEntity);
  }

  @Get(':id')
  @UseGuards(AgencyOwnershipGuard)
  async findOne(@Param('id') id: string) {
    const agency = await this.agenciesService.findOne(id);
    return AgencyResponseDto.fromEntity(agency);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  @UseGuards(AgencyOwnershipGuard)
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
