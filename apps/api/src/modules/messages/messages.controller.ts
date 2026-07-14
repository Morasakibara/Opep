import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Throttle({ short: { limit: 60, ttl: 60000 } })
  create(@Body() dto: CreateMessageDto, @GetUser('id') senderId: string) {
    return this.messagesService.create({ ...dto, senderId });
  }

  @Get()
  findConversation(@Query('userId1') userId1: string, @Query('userId2') userId2: string) {
    return this.messagesService.findConversation(userId1, userId2);
  }
}