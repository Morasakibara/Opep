import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: [{ phone: createUserDto.phone }, { email: createUserDto.email }],
    });

    if (existing) {
      throw new ConflictException('Utilisateur déjà existant (email ou téléphone)');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
    });

    return this.userRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { phone },
      select: ['id', 'firstName', 'lastName', 'phone', 'passwordHash', 'role', 'agencyId'],
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
