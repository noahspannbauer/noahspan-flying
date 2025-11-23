import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable() export class FileService {
  constructor(private readonly configService: ConfigService) {}

  private containerName: string;

  private streamToBuffer(readableStream: NodeJS.ReadableStream) {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks = [];

      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject)
    })
  }

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

  async uploadFile(file: Express.Multer.File, containerName: string, logId: string): Promise<string> {
    this.containerName = containerName;

    const blockBlobClient = await this.getBlobClient(`${logId}/${file.originalname}`);
    const fileUrl = blockBlobClient.url;
    
    await blockBlobClient.uploadData(file.buffer);

    return fileUrl;
  }

  async downloadFile(containerName: string, rowKey: string, fileName: string): Promise<string> {
    this.containerName = containerName;

    const blockBlobClient = await this.getBlobClient(`${rowKey}/${fileName}`);
    const downloadBlockBlobResponse = await blockBlobClient.download();
    const downloaded: string = (await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString()
    
    return downloaded
  }

  async deleteFile(containerName: string, logId: string, fileName: string): Promise<void> {
      this.containerName = containerName;

      const blockBlobClient = await this.getBlobClient(`${logId}/${fileName}`);

      await blockBlobClient.deleteIfExists();
  }

  async deleteFolder(containerName: string, logId: string): Promise<void> {
    const blobService = await this.getBlobServiceInstance();

    this.containerName = containerName;

    const containerClient = blobService.getContainerClient(containerName);
    const blobsToDelete = []

    for await (const blob of containerClient.listBlobsFlat({ prefix: logId })) {
      blobsToDelete.push(blob.name)
    }

    for (const blobName of blobsToDelete) {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.delete();
    }

    return;
  }
}