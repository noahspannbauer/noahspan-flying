import { InjectRepository } from "@nestjs/typeorm";
import { EndorsementEntity } from "./endorsement.entity";
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { EndorsementDto } from "./endorsement.dto";

@Injectable()
export class EndorsementService {
  constructor(
    @InjectRepository(EndorsementEntity) private readonly endorsementRepository: Repository<EndorsementEntity>
  ) {}

  async find(id: string): Promise<EndorsementEntity> {
    return await this.endorsementRepository.findOneBy({ id });
  }

  async findAll(): Promise<EndorsementEntity[]> {
    return await this.endorsementRepository.find();
  }

  async create(endorsement: EndorsementDto): Promise<InsertResult> {
    return await this.endorsementRepository.insert(endorsement);
  }

  async update(id: string, endorsement: EndorsementDto): Promise<UpdateResult> {
    return await this.endorsementRepository.update(id, endorsement);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.endorsementRepository.delete({ id }); 
  }
}