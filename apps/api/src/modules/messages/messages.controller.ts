import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.CASHIER, UserRole.CONTROLLER)
  @Throttle({ short: { limit: 60, ttl: 60000 } })
  create(@Body() dto: CreateMessageDto, @GetUser('id') senderId: string) {
    return this.messagesService.create({ ...dto, senderId });
  }

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.CASHIER, UserRole.CONTROLLER)
  async findAll() {
    // Return flat array for frontend compatibility (not paginated)
    return this.messagesService.findAllRaw();
  }

  @Get('conversation')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.CASHIER, UserRole.CONTROLLER)
  findConversation(@Query('userId1') userId1: string, @Query('userId2') userId2: string) {
    return this.messagesService.findConversation(userId1, userId2);
  }
}