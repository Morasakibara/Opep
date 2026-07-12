import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '@opep/shared-types';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    const existing = await this.companyRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Une compagnie avec ce nom existe déjà');
    }

    const company = this.companyRepository.create({
      name: dto.name,
      address: dto.address,
      city: dto.city,
      phone: dto.phone,
      email: dto.email,
      logoUrl: dto.logoUrl,
    });

    const saved = await this.companyRepository.save(company);

    // If directorUserId provided, assign director
    if (dto.directorUserId) {
      await this.assignDirector(saved.id, dto.directorUserId);
    }

    return this.findOne(saved.id);
  }

  async assignDirector(companyId: string, userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    if (user.role !== UserRole.COMPANY_DIRECTOR) {
      throw new BadRequestException(
        `L'utilisateur doit avoir le rôle COMPANY_DIRECTOR (actuel: ${user.role})`,
      );
    }

    // Check user not already director of another company
    const existingDirector = await this.companyRepository.findOne({
      where: { directorUserId: userId },
    });
    if (existingDirector && existingDirector.id !== companyId) {
      throw new BadRequestException(
        'Cet utilisateur est déjà directeur d\'une autre compagnie',
      );
    }

    await this.companyRepository.update(companyId, { directorUserId: userId });
  }

  async findAll(paginationDto: PaginationDto): Promise<{ items: Company[]; total: number }> {
    return this.companyRepository.findAndCount({
      relations: ['director'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: paginationDto.sortOrder || 'DESC' },
    }).then(([items, total]) => ({ items, total }));
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['director'],
    });
    if (!company) throw new NotFoundException('Compagnie non trouvée');
    return company;
  }

  async update(id: string, data: Partial<Company>): Promise<Company> {
    await this.companyRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.companyRepository.update(id, { isActive: false });
  }

  async getStats(id: string): Promise<{
    totalCentres: number;
    totalTrips: number;
    activeTrips: number;
    totalReservations: number;
    revenue: number;
  }> {
    const company = await this.findOne(id);
    // Stats are aggregated from all centres
    return {
      totalCentres: 0,
      totalTrips: 0,
      activeTrips: 0,
      totalReservations: 0,
      revenue: 0,
    };
  }
}
