import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusesService } from './buses.service';
import { Bus } from '../entities/bus.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('BusesService', () => {
  let service: BusesService;
  let repo: Repository<Bus>;

  const mockBus = {
    id: 'b-1',
    agencyId: 'ag-1',
    licensePlate: 'DK-1234-AB',
    model: 'Mercedes Sprinter',
    capacity: 30,
    seatLayout: { rows: 10, cols: 3 },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        BusesService,
        { provide: getRepositoryToken(Bus), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<BusesService>(BusesService);
    repo = module.get(getRepositoryToken(Bus));
  });

  describe('create', () => {
    it('creates a bus for the given agency', async () => {
      mockRepository.create.mockReturnValue(mockBus);
      mockRepository.save.mockResolvedValue(mockBus);

      const result = await service.create('ag-1', {
        plateNumber: 'DK-1234-AB',
        model: 'Mercedes Sprinter',
        totalSeats: 30,
        seatLayout: { rows: 10, cols: 3, aisleIndices: [], unavailableSeats: [] },
      });

      expect(result.id).toBe('b-1');
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ agencyId: 'ag-1' }),
      );
    });
  });

  describe('findAll', () => {
    it('returns paginated active buses for the agency', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBus], 1]);
      const paginationDto = new PaginationDto();
      const result = await service.findAll('ag-1', paginationDto);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns a bus when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockBus);
      const result = await service.findOne('ag-1', 'b-1');
      expect(result.id).toBe('b-1');
    });

    it('throws NotFoundException when bus is missing', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('ag-1', 'unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('soft-deletes the bus by setting isActive to false', async () => {
      mockRepository.findOne.mockResolvedValue(mockBus);
      mockRepository.save.mockResolvedValue({ ...mockBus, isActive: false });
      await service.remove('ag-1', 'b-1');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
