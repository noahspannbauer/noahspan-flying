
import { MedicalEntity } from "./medical.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { MedicalDto } from "./medical.dto";

@Injectable()
export class MedicalService {
  constructor(
    @InjectRepository(MedicalEntity) private readonly medicalRepository: Repository<MedicalEntity>
  ) {}

  async find(id: string): Promise<MedicalEntity> {
    return await this.medicalRepository.findOneBy({ id });
  }

  async findAll(): Promise<MedicalEntity[]> {
    return await this.medicalRepository.find();
  }

  async create(medical: MedicalDto): Promise<InsertResult> {
    return await this.medicalRepository.insert(medical)
  }

  async update(id: string, medical: MedicalDto): Promise<UpdateResult> {
    return await this.medicalRepository.update(id, medical);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.medicalRepository.delete({ id });
  }
}