import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from '../entities/agency.entity';
import { CreateAgencyDto } from '../dto/create-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    const existing = await this.agencyRepository.findOne({
      where: { name: createAgencyDto.name },
    });
    if (existing) {
      throw new ConflictException('Une agence avec ce nom existe déjà');
    }

    const agency = this.agencyRepository.create(createAgencyDto);
    return this.agencyRepository.save(agency);
  }

  async findAll(): Promise<Agency[]> {
    return this.agencyRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Agency> {
    const agency = await this.agencyRepository.findOneBy({ id });
    if (!agency) throw new NotFoundException('Agence non trouvée');
    return agency;
  }

  async update(id: string, updateAgencyDto: any): Promise<Agency> {
    await this.agencyRepository.update(id, updateAgencyDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.agencyRepository.update(id, { isActive: false });
  }
}
