import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PasswordService } from '../../../common/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: [{ phone: createUserDto.phone }, { email: createUserDto.email }],
    });

    if (existing) {
      throw new ConflictException('Utilisateur déjà existant (email ou téléphone)');
    }

    const passwordHash = await this.passwordService.hash(createUserDto.password);
    
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
    });

    return this.userRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { phone },
      // passwordHash est déjà exclu via { select: false } sur l'entité
    });
  }

  async findByIdentifier(identifier: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :identifier OR user.phone = :identifier', { identifier })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async findByIdentifierByUserId(id: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async findAll(paginationDto: PaginationDto): Promise<{ items: User[]; total: number }> {
    const [items, total] = await this.userRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: paginationDto.sortOrder || 'DESC' },
    });
    return { items, total };
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async toggleActivation(id: string, activate: boolean): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    await this.userRepository.update(id, { isActive: activate });
    return this.findById(id);
  }

  async createAgencyStaff(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.agencyId) {
      throw new BadRequestException('Un employé d\'agence doit avoir un agencyId');
    }
    if (!createUserDto.email) {
      throw new BadRequestException('Un employé d\'agence doit avoir un email');
    }
    return this.create(createUserDto);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
