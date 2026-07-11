import { Controller, Get, Post, Body, UseGuards, Query, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async create(
    @Body() body: { tripId: string; agencyId: string; driverRating: number; comfortRating: number; comment?: string },
    @GetUser('id') clientId: string,
  ) {
    return this.reviewService.create(clientId, body);
  }

  @Get('agency/:agencyId')
  async findByAgency(@Param('agencyId') agencyId: string, @Query() paginationDto: PaginationDto) {
    const { items, total } = await this.reviewService.findByAgency(agencyId, paginationDto);
    return paginate(items, total, paginationDto);
  }

  @Get('agency/:agencyId/stats')
  async getAgencyStats(@Param('agencyId') agencyId: string) {
    return this.reviewService.getAgencyAverageRating(agencyId);
  }
}
