import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(data: any): Promise<Message> {
    const message = this.messageRepository.create(data);
    const saved = await this.messageRepository.save(message);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAllRaw(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } }
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' }
    });
  }
}