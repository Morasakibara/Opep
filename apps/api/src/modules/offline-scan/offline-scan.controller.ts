import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { OfflineScanService } from './services/offline-scan.service';
import { CreateOfflineScanDto } from './dto/create-offline-scan.dto';
import { SyncBatchDto } from './dto/sync-batch.dto';
import { OfflineScanResponseDto } from './dto/offline-scan-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserRole } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Controller('offline-scans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OfflineScanController {
  constructor(private readonly offlineScanService: OfflineScanService) {}

  @Post()
  @Roles(UserRole.CONTROLLER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  async create(
    @Body() dto: CreateOfflineScanDto,
    @GetUser('id') userId: string,
  ) {
    const scan = await this.offlineScanService.create(dto, userId);
    return OfflineScanResponseDto.fromEntity(scan);
  }

  @Post('sync-batch')
  @Roles(UserRole.CONTROLLER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async syncBatch(
    @Body() dto: SyncBatchDto,
    @GetUser('id') userId: string,
  ) {
    const scans = await this.offlineScanService.syncBatch(dto, userId);
    return scans.map(OfflineScanResponseDto.fromEntity);
  }

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.offlineScanService.findAll(
      (paginationDto.page - 1) * paginationDto.limit,
      paginationDto.limit,
    );
    return paginate(items.map(OfflineScanResponseDto.fromEntity), total, paginationDto);
  }

  @Get('unsynced')
  @Roles(UserRole.CONTROLLER, UserRole.ADMIN_PLATFORM)
  async getUnsynced(@Query('deviceId') deviceId?: string) {
    const scans = await this.offlineScanService.getUnsynced(deviceId);
    return scans.map(OfflineScanResponseDto.fromEntity);
  }

  @Get('device/:deviceId')
  @Roles(UserRole.CONTROLLER, UserRole.ADMIN_PLATFORM)
  async findByDevice(
    @Param('deviceId') deviceId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const { items, total } = await this.offlineScanService.findByDevice(
      deviceId,
      (paginationDto.page - 1) * paginationDto.limit,
      paginationDto.limit,
    );
    return paginate(items.map(OfflineScanResponseDto.fromEntity), total, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.CONTROLLER)
  async findOne(@Param('id') id: string) {
    const scan = await this.offlineScanService.findOne(id);
    return OfflineScanResponseDto.fromEntity(scan);
  }

  @Post(':id/verify')
  @Roles(UserRole.ADMIN_PLATFORM)
  async verify(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    const scan = await this.offlineScanService.verifyScan(id, userId);
    return OfflineScanResponseDto.fromEntity(scan);
  }
}
