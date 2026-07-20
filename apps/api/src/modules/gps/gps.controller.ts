import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { GpsGateway } from './gps.gateway';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard, SubscriptionGuard)
export class GpsController {
  constructor(private readonly gpsGateway: GpsGateway) {}

  @Post(':id/location')
  @Roles(UserRole.DRIVER)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  async updateLocation(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    this.gpsGateway.broadcastLocation(tripId, {
      latitude: dto.latitude,
      longitude: dto.longitude,
      speed: dto.speed,
      heading: dto.heading,
    });

    return {
      message: 'Position mise à jour',
      tripId,
      subscriberCount: this.gpsGateway.getSubscriberCount(tripId),
    };
  }
}
