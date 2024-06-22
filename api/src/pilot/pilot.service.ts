import { Inject, Injectable } from '@nestjs/common';
import { Repository, InjectRepository } from '@nestjs/azure-database';
import { Medical } from './medical/medical.entity';
import { Profile } from './profile/profile.entity';
import { ProfileService } from './profile/profile.service';
import { Pilot } from './pilot.entity';

@Injectable()
export class PilotService {
  constructor(
    @InjectRepository(Pilot) private readonly pilotRepository: Repository<Pilot>
  ) {}

  async create(pilot: Pilot): Promise<Pilot> {
    return await this.pilotRepository.create(pilot);
  }
}
