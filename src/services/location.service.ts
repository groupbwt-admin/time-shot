import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CraeteLocationDto } from "../common/dtos/creat-location.dto";
import { LocationEntity } from "../database/entities/location.entity";
import { UserEntity } from "../database/entities/user.entity";

@Injectable()
export class LocationService {

  public logger = new Logger('LocationService');

  constructor(
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>
  ) { }

  async createLocation(creator_email: string, dto: CraeteLocationDto): Promise<LocationEntity> {
    const location = this.locationRepository.create({ creator_email, ...dto });
    await this.locationRepository.save(location);
    return location;
  }

  async findAllLocation(): Promise<LocationEntity[]> {
    return await this.locationRepository.find({ where: { deletedAt: null } });
  }

  async findOneLocationByName(name: string): Promise<LocationEntity> {
    return await this.locationRepository.findOne({ where: { name: name, deletedAt: null } });
  }

  async updateLocationByName(name: string, updateName: string): Promise<LocationEntity> {
    const location = await this.findOneLocationByName(name);
    if (!location) {
      return null;
    }
    location.name = updateName;
    await this.locationRepository.save(location);
    return location;
  }

  async deleteLocationByName(name: string): Promise<LocationEntity> {
    const location = await this.findOneLocationByName(name);
    if (!location) {
      return null;
    }
    location.deletedAt = new Date();
    await this.locationRepository.save(location);
    return location;
  }
}