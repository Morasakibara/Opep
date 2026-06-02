import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AgencyOwnershipGuard } from '../../auth/guards/agency-ownership.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { RoutesService } from '../services/routes.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard, AgencyOwnershipGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async create(@Body() createRouteDto: CreateRouteDto, @GetUser('agencyId') agencyId: string) {
    return this.routesService.create(agencyId, createRouteDto);
  }

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findAll(@GetUser('agencyId') agencyId: string) {
    return this.routesService.findAll(agencyId);
  }
}
