import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete, Query } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { OwnershipGuard } from '../../../common/guards/ownership.guard';
import { SubscriptionGuard } from '../../../common/guards/subscription.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { RoutesService } from '../services/routes.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { RouteResponseDto } from '../dto/route-response.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { PaginationDto, paginate } from '../../../common/dto/pagination.dto';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard, SubscriptionGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async create(@Body() createRouteDto: CreateRouteDto, @GetUser('agencyId') agencyId: string, @GetUser('centreId') centreId: string) {
    const route = await this.routesService.create(agencyId, centreId, createRouteDto);
    return RouteResponseDto.fromEntity(route);
  }

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findAll(@GetUser('agencyId') agencyId: string, @Query() paginationDto: PaginationDto) {
    const { items, total } = await this.routesService.findAll(agencyId, paginationDto);
    return paginate(items.map(RouteResponseDto.fromEntity), total, paginationDto);
  }

  @Get('cities')
  @SkipThrottle({ long: true, medium: true, short: true })
  @Throttle({ public: { limit: 30, ttl: 60000 } })
  async getCities() {
    return this.routesService.getCities();
  }

  @Get('search')
  @SkipThrottle({ long: true, medium: true, short: true })
  @Throttle({ public: { limit: 30, ttl: 60000 } })
  async searchRoutes(
    @Query('departureCity') departureCity: string,
    @Query('arrivalCity') arrivalCity: string,
  ) {
    return this.routesService.search(departureCity, arrivalCity);
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findOne(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    const route = await this.routesService.findOne(agencyId, id);
    return RouteResponseDto.fromEntity(route);
  }

  @Patch(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async update(
    @Param('id') id: string, 
    @Body() updateRouteDto: any, 
    @GetUser('agencyId') agencyId: string
  ) {
    const route = await this.routesService.update(agencyId, id, updateRouteDto);
    return RouteResponseDto.fromEntity(route);
  }

  @Delete(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async remove(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    await this.routesService.remove(agencyId, id);
    return { message: 'Ligne supprimée avec succès' };
  }
}
