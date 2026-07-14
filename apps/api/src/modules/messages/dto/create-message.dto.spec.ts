import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateMessageDto } from './create-message.dto';

describe('CreateMessageDto', () => {
  const validDto = {
    receiverId: '550e8400-e29b-41d4-a716-446655440000',
    content: 'Bonjour, votre bus est à l\'heure.',
  };

  it('accepts a valid DTO', async () => {
    const dto = plainToInstance(CreateMessageDto, validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rejects empty DTO', async () => {
    const dto = plainToInstance(CreateMessageDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    const props = errors.map((e) => e.property);
    expect(props).toContain('receiverId');
    expect(props).toContain('content');
  });

  it('rejects missing receiverId', async () => {
    const dto = plainToInstance(CreateMessageDto, { content: 'Hello' });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('receiverId');
  });

  it('rejects missing content', async () => {
    const dto = plainToInstance(CreateMessageDto, {
      receiverId: '550e8400-e29b-41d4-a716-446655440000',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('content');
  });

  it('rejects empty content string', async () => {
    const dto = plainToInstance(CreateMessageDto, {
      ...validDto,
      content: '',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('content');
  });

  it('rejects non-UUID receiverId', async () => {
    const dto = plainToInstance(CreateMessageDto, {
      ...validDto,
      receiverId: 'not-a-uuid',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('receiverId');
  });
});
