import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Throttle({ short: { limit: 60, ttl: 60000 } })
  create(@Body() body: any) {
    return this.messagesService.create(body);
  }

  @Get()
  findConversation(@Query('userId1') userId1: string, @Query('userId2') userId2: string) {
    return this.messagesService.findConversation(userId1, userId2);
  }
}