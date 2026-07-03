import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(UserResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':id')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    const user = await this.usersService.update(id, updateUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }
}
