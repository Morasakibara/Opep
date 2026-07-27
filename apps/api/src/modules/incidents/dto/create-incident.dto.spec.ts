import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateIncidentDto, IncidentType } from './create-incident.dto';

describe('CreateIncidentDto', () => {
  it('accepts valid incident data', async () => {
    const dto = new CreateIncidentDto();
    dto.type = IncidentType.DELAY;
    dto.description = 'Retard de 30 minutes';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects empty type', async () => {
    const dto = new CreateIncidentDto();
    dto.type = undefined as any;
    dto.description = 'Test';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('type');
  });

  it('rejects invalid enum value', async () => {
    const dto = new CreateIncidentDto();
    dto.type = 'INVALID' as any;
    dto.description = 'Test';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('type');
  });

  it('rejects empty description', async () => {
    const dto = new CreateIncidentDto();
    dto.type = IncidentType.ACCIDENT;
    dto.description = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('description');
  });

  it('accepts optional fields', async () => {
    const dto = new CreateIncidentDto();
    dto.type = IncidentType.MECHANICAL_BREAKDOWN;
    dto.description = 'Problème moteur';
    dto.reportedById = '550e8400-e29b-41d4-a716-446655440000';
    dto.tripId = '550e8400-e29b-41d4-a716-446655440001';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid UUID for optional fields', async () => {
    const dto = new CreateIncidentDto();
    dto.type = IncidentType.OTHER;
    dto.description = 'Test';
    dto.reportedById = 'not-a-uuid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('reportedById');
  });
});
