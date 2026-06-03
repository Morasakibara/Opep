import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from '../entities/bus.entity';
import { CreateBusDto } from '../dto/create-bus.dto';
import { UpdateBusDto } from '../dto/update-bus.dto';

@Injectable()
export class BusesService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async create(agencyId: string, createBusDto: CreateBusDto): Promise<Bus> {
    const bus = this.busRepository.create({
      ...createBusDto,
      agencyId,
    });
    return this.busRepository.save(bus);
  }

  async findAll(agencyId: string): Promise<Bus[]> {
    return this.busRepository.find({
      where: { agencyId, isActive: true },
      order: { plateNumber: 'ASC' },
    });
  }

  async findOne(agencyId: string, id: string): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id, agencyId },
    });
    if (!bus) {
      throw new NotFoundException(`Le bus avec l'ID ${id} est introuvable`);
    }
    return bus;
  }

  async update(agencyId: string, id: string, updateBusDto: UpdateBusDto): Promise<Bus> {
    const bus = await this.findOne(agencyId, id);
    Object.assign(bus, updateBusDto);
    return this.busRepository.save(bus);
  }

  async remove(agencyId: string, id: string): Promise<void> {
    const bus = await this.findOne(agencyId, id);
    bus.isActive = false;
    await this.busRepository.save(bus);
  }
}
