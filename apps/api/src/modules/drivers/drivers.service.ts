import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './drivers.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne({ where: { id }, relations: ['user'] });
    if (!driver) throw new NotFoundException('Chauffeur non trouvé');
    return driver;
  }

  async getPerformance(id: string) {
    const driver = await this.findOne(id);
    return {
      driverId: driver.id,
      rating: driver.rating,
      totalTrips: driver.totalTrips,
      performanceScore: driver.performanceScore || 90,
      safetyViolations: 0,
      punctualityRate: 95.5,
    };
  }

  async updateRating(id: string, newRating: number): Promise<Driver> {
    const driver = await this.findOne(id);
    driver.rating = (driver.rating * driver.totalTrips + newRating) / (driver.totalTrips + 1);
    driver.totalTrips += 1;
    return this.driverRepository.save(driver);
  }
}