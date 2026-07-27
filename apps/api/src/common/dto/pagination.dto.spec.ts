import { validate } from 'class-validator';
import { PaginationDto, paginate } from './pagination.dto';

describe('PaginationDto', () => {
  it('uses default values for empty DTO', async () => {
    const dto = new PaginationDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(20);
    expect(dto.sortOrder).toBe('DESC');
  });

  it('accepts custom valid values', async () => {
    const dto = new PaginationDto();
    dto.page = 2;
    dto.limit = 50;
    dto.sortBy = 'createdAt';
    dto.sortOrder = 'ASC';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects page < 1', async () => {
    const dto = new PaginationDto();
    dto.page = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('page');
  });

  it('rejects limit > 100', async () => {
    const dto = new PaginationDto();
    dto.limit = 200;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('limit');
  });

  it('rejects non-integer values', async () => {
    const dto = new PaginationDto();
    dto.page = 1.5 as any;

    const errors = await validate(dto);
    // class-transformer @Type decorator handles number conversion in runtime
    // but class-validator @IsInt will still reject decimals
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });
});

describe('paginate function', () => {
  const items = ['a', 'b', 'c'];

  it('returns correct pagination metadata', () => {
    const result = paginate(items, 30, { page: 2, limit: 10 });
    expect(result.data).toEqual(items);
    expect(result.meta.page).toBe(2);
    expect(result.meta.limit).toBe(10);
    expect(result.meta.totalItems).toBe(30);
    expect(result.meta.totalPages).toBe(3);
    expect(result.meta.hasNextPage).toBe(true);
    expect(result.meta.hasPreviousPage).toBe(true);
  });

  it('shows first page correctly', () => {
    const result = paginate(items, 5, { page: 1, limit: 10 });
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('shows last page correctly', () => {
    const result = paginate(items, 30, { page: 3, limit: 10 });
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(true);
  });
});
