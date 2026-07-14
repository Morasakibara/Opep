import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incidents.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  async create(data: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentRepository.create(data);
    const saved = await this.incidentRepository.save(incident);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(paginationDto: PaginationDto): Promise<{ items: Incident[]; total: number }> {
    const [items, total] = await this.incidentRepository.findAndCount({
      relations: ['reportedBy', 'trip'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: paginationDto.sortOrder || 'DESC' },
    });
    return { items, total };
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({ where: { id }, relations: ['reportedBy', 'trip'] });
    if (!incident) throw new NotFoundException('Incident non trouvé');
    return incident;
  }

  async resolve(id: string, refundAmount?: number): Promise<Incident> {
    const incident = await this.findOne(id);
    incident.status = 'RESOLVED';
    if (refundAmount) {
      incident.refundTriggered = true;
      incident.refundAmount = refundAmount;
    }
    const saved = await this.incidentRepository.save(incident);
    return Array.isArray(saved) ? saved[0] : saved;
  }
}