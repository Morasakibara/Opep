import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AgenciesService } from './services/agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AgencyOwnershipGuard } from '../auth/guards/agency-ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { UserRole } from '@opep/shared-types';

@Controller('agencies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM)
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agenciesService.create(createAgencyDto);
  }

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM)
  findAll() {
    return this.agenciesService.findAll();
  }

  @Get(':id')
  @UseGuards(AgencyOwnershipGuard)
  findOne(@Param('id') id: string) {
    return this.agenciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  @UseGuards(AgencyOwnershipGuard)
  update(@Param('id') id: string, @Body() updateAgencyDto: any) {
    // Note: L'AgencyOwnershipGuard vérifiera que l'user appartient bien à l'agence :id
    return this.agenciesService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLATFORM)
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(id);
  }
}
