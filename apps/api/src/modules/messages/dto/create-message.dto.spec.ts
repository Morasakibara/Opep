import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

describe('CreateMessageDto', () => {
  it('accepts valid message data', async () => {
    const dto = new CreateMessageDto();
    dto.receiverId = '550e8400-e29b-41d4-a716-446655440000';
    dto.content = 'Bonjour, votre ticket est prêt.';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects empty receiverId', async () => {
    const dto = new CreateMessageDto();
    dto.receiverId = '';
    dto.content = 'Test';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('receiverId');
  });

  it('rejects invalid UUID for receiverId', async () => {
    const dto = new CreateMessageDto();
    dto.receiverId = 'not-a-uuid';
    dto.content = 'Test';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('receiverId');
  });

  it('rejects empty content', async () => {
    const dto = new CreateMessageDto();
    dto.receiverId = '550e8400-e29b-41d4-a716-446655440000';
    dto.content = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('content');
  });

  it('rejects missing fields', async () => {
    const dto = new CreateMessageDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});
