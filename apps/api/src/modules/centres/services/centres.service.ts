import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Centre } from '../entities/centre.entity';
import { CreateCentreDto } from '../dto/create-centre.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class CentresService {
  constructor(
    @InjectRepository(Centre)
    private readonly centreRepository: Repository<Centre>,
  ) {}

  async create(dto: CreateCentreDto): Promise<Centre> {
    const centre = this.centreRepository.create({
      companyId: dto.companyId,
      managerUserId: dto.managerUserId,
      name: dto.name,
      city: dto.city,
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
    });
    return this.centreRepository.save(centre);
  }

  async findAll(paginationDto: PaginationDto, companyId?: string): Promise<{ items: Centre[]; total: number }> {
    const where: any = {};
    if (companyId) where.companyId = companyId;
    return this.centreRepository.findAndCount({
      where,
      relations: ['company', 'manager'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: paginationDto.sortOrder || 'DESC' },
    }).then(([items, total]) => ({ items, total }));
  }

  async findOne(id: string): Promise<Centre> {
    const centre = await this.centreRepository.findOne({
      where: { id },
      relations: ['company', 'manager'],
    });
    if (!centre) throw new NotFoundException('Centre non trouvé');
    return centre;
  }

  async update(id: string, data: Partial<Centre>): Promise<Centre> {
    await this.centreRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.centreRepository.update(id, { isActive: false });
  }

  async getStats(id: string): Promise<any> {
    await this.findOne(id);
    return {
      totalBuses: 0,
      totalTrips: 0,
      activeTrips: 0,
      totalReservations: 0,
      revenue: 0,
    };
  }

  async getRanking(): Promise<Centre[]> {
    return this.centreRepository.find({
      where: { isActive: true, reviewsCount: 5 },
      order: { publicRatingAverage: 'DESC' },
      take: 50,
    });
  }
}
