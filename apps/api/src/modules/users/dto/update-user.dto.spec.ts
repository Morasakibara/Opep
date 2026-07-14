import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';
import { UserRole, Language, NotificationChannel } from '@opep/shared-types';

describe('UpdateUserDto', () => {
  it('accepts empty DTO (all fields optional)', async () => {
    const dto = plainToInstance(UpdateUserDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('accepts valid partial update with all field types', async () => {
    const dto = plainToInstance(UpdateUserDto, {
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+237690000001',
      email: 'jean@opep.cm',
      role: UserRole.CONTROLLER,
      isActive: true,
      preferredLanguage: Language.FR,
      notificationChannel: NotificationChannel.WHATSAPP,
      notificationPhone: '+237690000002',
      avatarUrl: 'https://example.com/avatar.jpg',
      fcmToken: 'fcm-token-123',
      agencyId: '550e8400-e29b-41d4-a716-446655440000',
      companyId: '660e8400-e29b-41d4-a716-446655440001',
      centreId: '770e8400-e29b-41d4-a716-446655440002',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rejects invalid email', async () => {
    const dto = plainToInstance(UpdateUserDto, { email: 'not-an-email' });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
  });

  it('rejects invalid role enum value', async () => {
    const dto = plainToInstance(UpdateUserDto, { role: 'INVALID_ROLE' });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('role');
  });

  it('rejects invalid language enum value', async () => {
    const dto = plainToInstance(UpdateUserDto, { preferredLanguage: 'invalid' });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('preferredLanguage');
  });

  it('rejects non-boolean isActive', async () => {
    const dto = plainToInstance(UpdateUserDto, { isActive: 'yes' });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('isActive');
  });

  it('rejects non-UUID agencyId', async () => {
    const dto = plainToInstance(UpdateUserDto, { agencyId: 'bad-uuid' });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('agencyId');
  });

  it('accepts single field update (partial)', async () => {
    const dto = plainToInstance(UpdateUserDto, { firstName: 'Marie' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
