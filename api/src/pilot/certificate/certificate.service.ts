import { Injectable } from '@nestjs/common';
import { Repository, InjectRepository } from '@nestjs/azure-database';
import { Certificate } from './certificate.entity';

@Injectable()
export class CertificateService {
  private readonly partitionKey: string = 'certificate';

  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>
  ) {}

  async find(rowKey: string): Promise<Certificate> {
    return await this.certificateRepository.find(this.partitionKey, rowKey);
  }

  async findAll(): Promise<Certificate[]> {
    return await this.certificateRepository.findAll();
  }

  async create(certificate: Certificate): Promise<Certificate> {
    return await this.certificateRepository.create(certificate);
  }

  async update(rowKey: string, certificate: Certificate): Promise<Certificate> {
    return await this.certificateRepository.update(
      this.partitionKey,
      rowKey,
      certificate
    );
  }

  async delete(rowKey: string): Promise<void> {
    await this.certificateRepository.delete(this.partitionKey, rowKey);
  }
}
