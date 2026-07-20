import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ComplaintsService } from './services/complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintResponseDto } from './dto/complaint-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { UserRole, ComplaintStatus } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('complaints')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async create(@Body() dto: CreateComplaintDto, @GetUser('id') clientId: string) {
    const complaint = await this.complaintsService.create(dto, clientId);
    return ComplaintResponseDto.fromEntity(complaint);
  }

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.COMPANY_DIRECTOR, UserRole.CENTRE_MANAGER)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.complaintsService.findAll(paginationDto);
    return paginate(items.map(ComplaintResponseDto.fromEntity), total, paginationDto);
  }

  @Get('my')
  @Roles(UserRole.CLIENT)
  async getMyComplaints(@GetUser('id') clientId: string, @Query() paginationDto: PaginationDto) {
    const { items, total } = await this.complaintsService.getMyComplaints(clientId, paginationDto);
    return paginate(items.map(ComplaintResponseDto.fromEntity), total, paginationDto);
  }

  @Get('centre/:centreId')
  @Roles(UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  async findByCentre(@Param('centreId') centreId: string, @Query() paginationDto: PaginationDto) {
    const { items, total } = await this.complaintsService.findByCentre(centreId, paginationDto);
    return paginate(items.map(ComplaintResponseDto.fromEntity), total, paginationDto);
  }

  @Get('company/:companyId')
  @Roles(UserRole.COMPANY_DIRECTOR, UserRole.ADMIN_PLATFORM)
  async findByCompany(@Param('companyId') companyId: string, @Query() paginationDto: PaginationDto) {
    const { items, total } = await this.complaintsService.findByCompany(companyId, paginationDto);
    return paginate(items.map(ComplaintResponseDto.fromEntity), total, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.CENTRE_MANAGER, UserRole.COMPANY_DIRECTOR, UserRole.CLIENT, UserRole.ADMIN_PLATFORM)
  async findOne(@Param('id') id: string) {
    const complaint = await this.complaintsService.findOne(id);
    return ComplaintResponseDto.fromEntity(complaint);
  }

  @Patch(':id/status')
  @Roles(UserRole.CENTRE_MANAGER, UserRole.COMPANY_DIRECTOR, UserRole.ADMIN_PLATFORM)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ComplaintStatus,
    @Body('response') response?: string,
    @GetUser('id') userId?: string,
  ) {
    const complaint = await this.complaintsService.updateStatus(id, status, response, userId);
    return ComplaintResponseDto.fromEntity(complaint);
  }
}
