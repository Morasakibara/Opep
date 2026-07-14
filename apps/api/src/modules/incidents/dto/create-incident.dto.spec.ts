import { validate, IsEnum, IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateIncidentDto, IncidentType } from './create-incident.dto';

describe('CreateIncidentDto', () => {
  const validDto = {
    type: IncidentType.ACCIDENT,
    description: 'Accident de bus sur la route Yaoundé-Douala',
    reportedById: '550e8400-e29b-41d4-a716-446655440000',
    tripId: '660e8400-e29b-41d4-a716-446655440001',
  };

  it('accepts a fully valid DTO', async () => {
    const dto = plainToInstance(CreateIncidentDto, validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('accepts minimal DTO (only required fields)', async () => {
    const dto = plainToInstance(CreateIncidentDto, {
      type: IncidentType.DELAY,
      description: 'Retard de 30 minutes',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rejects empty DTO', async () => {
    const dto = plainToInstance(CreateIncidentDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(2);
    const props = errors.map((e) => e.property);
    expect(props).toContain('type');
    expect(props).toContain('description');
  });

  it('rejects invalid incident type', async () => {
    const dto = plainToInstance(CreateIncidentDto, {
      ...validDto,
      type: 'INVALID_TYPE',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('type');
  });

  it('rejects empty description', async () => {
    const dto = plainToInstance(CreateIncidentDto, {
      ...validDto,
      description: '',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('description');
  });

  it('rejects non-UUID reportedById', async () => {
    const dto = plainToInstance(CreateIncidentDto, {
      ...validDto,
      reportedById: 'not-a-uuid',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('reportedById');
  });

  it('rejects non-UUID tripId', async () => {
    const dto = plainToInstance(CreateIncidentDto, {
      ...validDto,
      tripId: 'not-a-uuid',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('tripId');
  });

  it('accepts all valid incident types', async () => {
    for (const type of Object.values(IncidentType)) {
      const dto = plainToInstance(CreateIncidentDto, {
        type,
        description: 'Test incident',
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });
});
