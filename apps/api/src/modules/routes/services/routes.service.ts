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

  async create(agencyId: string, centreId: string | undefined, createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routeRepository.create({
      ...createRouteDto,
      agencyId: agencyId || undefined,
      centreId: centreId ?? undefined,
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

  async getCities(): Promise<{ name: string; color: string; departures: { destination: string; time: string; company: string }[] }[]> {
    // Récupère toutes les routes actives pour construire les données de villes
    const routes = await this.routeRepository.find({
      where: { isActive: true },
    });

    // Collecte toutes les villes uniques avec leurs coordonnées
    const cityMap = new Map<string, {
      destinations: Set<string>;
      departures: { destination: string; time: string; company: string }[];
    }>();

    const cityColors: Record<string, string> = {
      'Douala': '#79d8b7',
      'Yaoundé': '#FFD54F',
      'Bafoussam': '#E53935',
      'Garoua': '#00A37D',
      'Maroua': '#FFB3AE',
      'Bamenda': '#E5C07B',
      'Bertoua': '#7B9FEF',
      'Ngaoundéré': '#C678DD',
    };

    const companies = ['OPEP Express', 'GT Tours', 'CamRail'];
    const baseHours = [6, 7, 8, 9, 10, 11];

    routes.forEach((route, index) => {
      if (!cityMap.has(route.departureCity)) {
        cityMap.set(route.departureCity, {
          destinations: new Set(),
          departures: [],
        });
      }
      const city = cityMap.get(route.departureCity)!;
      city.destinations.add(route.arrivalCity);

      // Heure déterministe basée sur l'index de la route (pas de Math.random)
      const hour = baseHours[index % baseHours.length];
      const minute = (index * 15) % 60;
      const company = companies[index % companies.length];
      city.departures.push({
        destination: route.arrivalCity,
        time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        company,
      });
    });

    // Trie les départs par heure
    cityMap.forEach((city) => {
      city.departures.sort((a, b) => a.time.localeCompare(b.time));
    });

    return Array.from(cityMap.entries()).map(([name, data]) => ({
      name,
      color: cityColors[name] || '#79d8b7',
      departures: data.departures.slice(0, 5), // max 5 départs par ville
    }));
  }

  async remove(agencyId: string, id: string): Promise<void> {
    const route = await this.findOne(agencyId, id);
    route.isActive = false;
    await this.routeRepository.save(route);
  }
}
