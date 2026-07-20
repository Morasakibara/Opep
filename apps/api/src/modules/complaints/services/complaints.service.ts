import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint, ComplaintStatus } from '../entities/complaint.entity';
import { CreateComplaintDto } from '../dto/create-complaint.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ items: Complaint[]; total: number }> {
    return this.complaintRepository.findAndCount({
      relations: ['client'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: 'DESC' },
    }).then(([items, total]) => ({ items, total }));
  }

  async create(dto: CreateComplaintDto, clientId: string): Promise<Complaint> {
    const complaint = this.complaintRepository.create({
      tripId: dto.tripId,
      reservationId: dto.reservationId,
      clientId,
      centreId: dto.centreId,
      companyId: dto.companyId,
      category: dto.category,
      description: dto.description,
    });
    return this.complaintRepository.save(complaint);
  }

  // CENTRE_MANAGER & COMPANY_DIRECTOR only — filtered by centreId/companyId
  async findByCentre(
    centreId: string,
    paginationDto: PaginationDto,
  ): Promise<{ items: Complaint[]; total: number }> {
    return this.complaintRepository.findAndCount({
      where: { centreId },
      relations: ['client'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: 'DESC' },
    }).then(([items, total]) => ({ items, total }));
  }

  async findByCompany(
    companyId: string,
    paginationDto: PaginationDto,
  ): Promise<{ items: Complaint[]; total: number }> {
    return this.complaintRepository.findAndCount({
      where: { companyId },
      relations: ['client'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: 'DESC' },
    }).then(([items, total]) => ({ items, total }));
  }

  async findOne(id: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!complaint) throw new NotFoundException('Litige non trouvé');
    return complaint;
  }

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    response?: string,
    resolvedBy?: string,
  ): Promise<Complaint> {
    const updateData: any = { status };
    if (response !== undefined) updateData.response = response;
    if (status === ComplaintStatus.RESOLVED || status === ComplaintStatus.REJECTED) {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = resolvedBy;
    }
    await this.complaintRepository.update(id, updateData);
    return this.findOne(id);
  }

  async getMyComplaints(
    clientId: string,
    paginationDto: PaginationDto,
  ): Promise<{ items: Complaint[]; total: number }> {
    return this.complaintRepository.findAndCount({
      where: { clientId },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: 'DESC' },
    }).then(([items, total]) => ({ items, total }));
  }
}
