import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SeatsService } from './seats.service';
import { Seat, SeatStatus } from '../entities/seat.entity';
import { Trip } from '../../trips/entities/trip.entity';

describe('SeatsService', () => {
  let service: SeatsService;
  let seatRepository: Repository<Seat>;
  let tripRepository: Repository<Trip>;

  const mockTrip = { id: 'trip-1', busId: 'bus-1' } as Trip;

  const mockSeat = {
    id: 'seat-1',
    tripId: 'trip-1',
    seatNumber: '1A',
    status: SeatStatus.AVAILABLE,
    isWindow: true,
    isAisle: false,
    rowNumber: 1,
    colLetter: 'A',
  } as Seat;

  const mockSeatRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTripRepository = {
    findOne: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatsService,
        { provide: getRepositoryToken(Seat), useValue: mockSeatRepository },
        { provide: getRepositoryToken(Trip), useValue: mockTripRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<SeatsService>(SeatsService);
    seatRepository = module.get<Repository<Seat>>(getRepositoryToken(Seat));
    tripRepository = module.get<Repository<Trip>>(getRepositoryToken(Trip));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a seat successfully', async () => {
      mockTripRepository.findOne.mockResolvedValue(mockTrip);
      mockSeatRepository.findOne.mockResolvedValue(null);
      mockSeatRepository.create.mockReturnValue(mockSeat);
      mockSeatRepository.save.mockResolvedValue(mockSeat);

      const result = await service.create({
        tripId: 'trip-1',
        seatNumber: '1A',
      });

      expect(result).toEqual(mockSeat);
      expect(mockSeatRepository.create).toHaveBeenCalledWith({
        tripId: 'trip-1',
        seatNumber: '1A',
        isWindow: false,
        isAisle: false,
        rowNumber: 1,
        colLetter: 'A',
      });
    });

    it('should throw if trip not found', async () => {
      mockTripRepository.findOne.mockResolvedValue(null);
      await expect(service.create({ tripId: 'invalid', seatNumber: '1A' })).rejects.toThrow('Voyage non trouvé');
    });

    it('should throw if seat already exists', async () => {
      mockTripRepository.findOne.mockResolvedValue(mockTrip);
      mockSeatRepository.findOne.mockResolvedValue(mockSeat);
      await expect(service.create({ tripId: 'trip-1', seatNumber: '1A' })).rejects.toThrow('existe déjà');
    });
  });

  describe('findByTrip', () => {
    it('should return seats for a trip', async () => {
      mockSeatRepository.find.mockResolvedValue([mockSeat]);
      const result = await service.findByTrip('trip-1');
      expect(result).toEqual([mockSeat]);
      expect(mockSeatRepository.find).toHaveBeenCalledWith({
        where: { tripId: 'trip-1' },
        order: { rowNumber: 'ASC', colLetter: 'ASC' },
      });
    });
  });

  describe('lockSeats', () => {
    it('should lock available seats', async () => {
      mockSeatRepository.find.mockResolvedValue([{ ...mockSeat, status: SeatStatus.AVAILABLE }]);
      mockSeatRepository.save.mockResolvedValue({ ...mockSeat, status: SeatStatus.RESERVED });

      const result = await service.lockSeats({ seatIds: ['seat-1'], lockedBy: 'user-1' });
      expect(result[0].status).toBe(SeatStatus.RESERVED);
    });

    it('should throw if seat is not available', async () => {
      mockSeatRepository.find.mockResolvedValue([{ ...mockSeat, status: SeatStatus.OCCUPIED }]);
      await expect(service.lockSeats({ seatIds: ['seat-1'], lockedBy: 'user-1' })).rejects.toThrow('pas disponible');
    });
  });
});
