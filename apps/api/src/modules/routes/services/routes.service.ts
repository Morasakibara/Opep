import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../entities/route.entity';
import { CreateRouteDto } from '../dto/create-route.dto';

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

  async findAll(agencyId: string): Promise<Route[]> {
    return this.routeRepository.find({
      where: { agencyId, isActive: true },
    });
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

  async remove(agencyId: string, id: string): Promise<void> {
    const route = await this.findOne(agencyId, id);
    route.isActive = false;
    await this.routeRepository.save(route);
  }
}
