import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AgencyOwnershipGuard } from '../../auth/guards/agency-ownership.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { RoutesService } from '../services/routes.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { RouteResponseDto } from '../dto/route-response.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard, AgencyOwnershipGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async create(@Body() createRouteDto: CreateRouteDto, @GetUser('agencyId') agencyId: string) {
    const route = await this.routesService.create(agencyId, createRouteDto);
    return RouteResponseDto.fromEntity(route);
  }

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findAll(@GetUser('agencyId') agencyId: string) {
    const routes = await this.routesService.findAll(agencyId);
    return routes.map(RouteResponseDto.fromEntity);
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findOne(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    const route = await this.routesService.findOne(agencyId, id);
    return RouteResponseDto.fromEntity(route);
  }

  @Patch(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async update(
    @Param('id') id: string, 
    @Body() updateRouteDto: any, 
    @GetUser('agencyId') agencyId: string
  ) {
    const route = await this.routesService.update(agencyId, id, updateRouteDto);
    return RouteResponseDto.fromEntity(route);
  }

  @Delete(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async remove(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    await this.routesService.remove(agencyId, id);
    return { message: 'Ligne supprimée avec succès' };
  }
}
