import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../entities/route.entity';
import { CreateRouteDto } from '../dto/create-route.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async create(agencyId: string, createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routeRepository.create({
      ...createRouteDto,
      agencyId,
    });
    return this.routeRepository.save(route);
  }

  async findAll(agencyId: string, paginationDto: PaginationDto): Promise<{ items: Route[]; total: number }> {
    const [items, total] = await this.routeRepository.findAndCount({
      where: { agencyId, isActive: true },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: paginationDto.sortOrder || 'DESC' },
    });
    return { items, total };
  }

  async findOne(agencyId: string, id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id, agencyId },
    });
    if (!route) throw new NotFoundException('Ligne non trouvée');
    return route;
  }

  async update(agencyId: string, id: string, updateRouteDto: any): Promise<Route> {
    const route = await this.findOne(agencyId, id);
    Object.assign(route, updateRouteDto);
    return this.routeRepository.save(route);
  }

  async search(departureCity?: string, arrivalCity?: string): Promise<Route[]> {
    const where: any = { isActive: true };
    if (departureCity) where.departureCity = departureCity;
    if (arrivalCity) where.arrivalCity = arrivalCity;
    return this.routeRepository.find({ where });
  }

  async remove(agencyId: string, id: string): Promise<void> {
    const route = await this.findOne(agencyId, id);
    route.isActive = false;
    await this.routeRepository.save(route);
  }
}
