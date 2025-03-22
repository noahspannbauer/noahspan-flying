import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable() export class FileService {
  constructor(private readonly configService: ConfigService) {}

  private containerName: string;

  async getBlobServiceInstance() {
    const connectionString = this.configService.get<string>('azureStorageConnectionString');
    const blobServiceClient: BlobServiceClient = await BlobServiceClient.fromConnectionString(connectionString)

    return blobServiceClient;
  }

  async getBlobClient(fileName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerName = this.containerName;
    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    return blockBlobClient;
  }

  async uploadFile(file: Express.Multer.File, containerName: string, rowKey: string) {
    this.containerName = containerName;

    const blockBlobClient = await this.getBlobClient(`${rowKey}/${file.originalname}`);
    const fileUrl = blockBlobClient.url;
    
    await blockBlobClient.uploadData(file.buffer);

    return fileUrl;
  }

  async deleteFile(containerName: string, rowKey:string, fileName: string) {
      this.containerName = containerName;

      const blockBlobClient = await this.getBlobClient(`${rowKey}/${fileName}`);

      await blockBlobClient.deleteIfExists();
  }
}