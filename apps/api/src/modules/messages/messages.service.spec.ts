import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { Message } from './messages.entity';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockMessage = {
    id: 'msg-1',
    content: 'Bonjour',
    sender: { id: 'u-1', firstName: 'Jean' },
    receiver: { id: 'u-2', firstName: 'Marie' },
    createdAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(Message), useValue: mockRepository },
      ],
    }).compile();
    service = module.get(MessagesService);
  });

  describe('create', () => {
    it('creates and returns a message', async () => {
      const dto = { content: 'Hello', senderId: 'u-1', receiverId: 'u-2' };
      mockRepository.create.mockReturnValue(mockMessage);
      mockRepository.save.mockResolvedValue(mockMessage);

      const result = await service.create(dto);
      expect(result.id).toBe('msg-1');
      expect(result.content).toBe('Bonjour');
    });
  });

  describe('findAllRaw', () => {
    it('returns recent messages with relations', async () => {
      mockRepository.find.mockResolvedValue([mockMessage]);
      const result = await service.findAllRaw();
      expect(result).toHaveLength(1);
      expect(result[0].sender.firstName).toBe('Jean');
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['sender', 'receiver'],
        order: { createdAt: 'DESC' },
        take: 100,
      });
    });
  });

  describe('findConversation', () => {
    it('returns messages between two users sorted ascending', async () => {
      mockRepository.find.mockResolvedValue([mockMessage]);
      const result = await service.findConversation('u-1', 'u-2');
      expect(result).toHaveLength(1);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [
          { sender: { id: 'u-1' }, receiver: { id: 'u-2' } },
          { sender: { id: 'u-2' }, receiver: { id: 'u-1' } },
        ],
        relations: ['sender', 'receiver'],
        order: { createdAt: 'ASC' },
      });
    });
  });
});
