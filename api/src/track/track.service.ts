import { DeleteResult, InsertResult, Repository, UpdateResult } from "typeorm";
import { TrackDto } from "./track.dto";
import { TrackEntity } from "./track.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { LogService } from "src/log/log.service";
import { LogEntity } from "src/log/log.entity";
import { CustomError } from "src/error/customError";
import { FileService } from "src/file/file.service";

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity) private readonly trackRepository: Repository<TrackEntity>,
    private readonly fileService: FileService,
    private readonly logService: LogService
  ) {}

  // async find(id: string): Promise<TrackEntity> {
  //   return await this.trackRepository.findOneBy({ id });
  // }

  // async findAll(logId: string): Promise<TrackEntity[]> {
  //   try {
  //     await this.trackRepository.findOneBy({ })
  //   } catch (error) {

  //   }
    
  // }

  async create(logId: string, order: number, file: Express.Multer.File): Promise<InsertResult> {
    try {
      const logEntity: LogEntity = await this.logService.find(logId);

      if (logEntity) {
        const containerName = 'tracks';
        const url = await this.fileService.uploadFile(file, containerName, logId);
        const track = this.trackRepository.create({
          log: logEntity,
          order: order,
          url: url
        });

        return await this.trackRepository.insert(track);
      } else {
        throw new CustomError('Log not found', 'Not found', 404)
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  // async update(id: string, track: TrackDto): Promise<UpdateResult> {
  //   return await this.trackRepository.update(id, track);
  // }

  async delete(id: string): Promise<DeleteResult> {
    try {

    } catch (error) {

    }
    return await this.trackRepository.delete({ id });
  }

  // async createTrack()

  // async downloadTrack(): Promise<string> {
  //   const containerName = 'tracks';
  //   const downloadedFile: string = await this.fileService.downloadFile(containerName, rowKey, fileName);

  //   return downloadedFile;
  // }

  // async deleteTrack(): Promsie<void> {
  //   try {
  //     const containerName = 'tracks';

  //     return await this.fileService.deleteFile(containerName, rowKey, fileName)
  //   } catch (error) {
  //     const customError = error as CustomError;

  //     throw customError;
  //   }
  // }
}