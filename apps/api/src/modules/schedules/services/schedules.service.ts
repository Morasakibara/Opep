import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { isActive: true },
      relations: ['route'],
      order: { departureTime: 'ASC' },
    });
  }

  async findByRouteId(routeId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { routeId, isActive: true },
      order: { departureTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['route'],
    });
    if (!schedule) throw new NotFoundException('Horaire non trouvé');
    return schedule;
  }

  async create(data: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(data);
    return this.scheduleRepository.save(schedule);
  }

  async update(id: string, data: Partial<Schedule>): Promise<Schedule> {
    const schedule = await this.findOne(id);
    Object.assign(schedule, data);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    schedule.isActive = false;
    await this.scheduleRepository.save(schedule);
  }

  /** Get city departures grouped by departure city */
  async getCityDepartures(): Promise<{ name: string; departures: { destination: string; time: string; company: string }[] }[]> {
    const schedules = await this.scheduleRepository.find({
      where: { isActive: true },
      relations: ['route'],
      order: { departureTime: 'ASC' },
    });

    const cityMap = new Map<string, { destination: string; time: string; company: string }[]>();
    const cityColors: Record<string, string> = {
      Douala: '#79d8b7', Yaoundé: '#FFD54F', Bafoussam: '#E53935',
      Garoua: '#00A37D', Maroua: '#FFB3AE', Bamenda: '#E5C07B',
      Bertoua: '#7B9FEF', Ngaoundéré: '#C678DD',
    };

    for (const schedule of schedules) {
      const route = schedule.route;
      if (!route) continue;

      const city = route.departureCity;
      if (!cityMap.has(city)) cityMap.set(city, []);
      cityMap.get(city)!.push({
        destination: route.arrivalCity,
        time: schedule.departureTime,
        company: schedule.company,
      });
    }

    return Array.from(cityMap.entries()).map(([name, departures]) => ({
      name,
      departures: departures.slice(0, 5),
    }));
  }
}
