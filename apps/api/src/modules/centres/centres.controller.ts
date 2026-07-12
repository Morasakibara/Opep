import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CentresService } from './services/centres.service';
import { CreateCentreDto } from './dto/create-centre.dto';
import { CentreResponseDto } from './dto/centre-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { UserRole } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('centres')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard, SubscriptionGuard)
export class CentresController {
  constructor(private readonly centresService: CentresService) {}

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async create(@Body() dto: CreateCentreDto) {
    const centre = await this.centresService.create(dto);
    return CentreResponseDto.fromEntity(centre);
  }

  @Get('ranking')
  @Throttle({ public: { limit: 60, ttl: 60000 } })
  async getRanking() {
    const centres = await this.centresService.getRanking();
    return centres.map(CentreResponseDto.fromEntity);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: any,
  ) {
    let companyId: string | undefined;
    if (user.role === UserRole.COMPANY_DIRECTOR) {
      companyId = user.companyId;
    }
    const { items, total } = await this.centresService.findAll(paginationDto, companyId);
    return paginate(items.map(CentreResponseDto.fromEntity), total, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const centre = await this.centresService.findOne(id);
    return CentreResponseDto.fromEntity(centre);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR, UserRole.CENTRE_MANAGER)
  async getStats(@Param('id') id: string) {
    return this.centresService.getStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async update(@Param('id') id: string, @Body() data: any) {
    const centre = await this.centresService.update(id, data);
    return CentreResponseDto.fromEntity(centre);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.COMPANY_DIRECTOR)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async remove(@Param('id') id: string) {
    await this.centresService.remove(id);
    return { message: 'Centre désactivé avec succès' };
  }
}
