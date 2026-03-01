import { DeleteResult, InsertResult, Repository, UpdateResult } from "typeorm";
import { TrackDto } from "./track.dto";
import { TrackEntity } from "./track.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { LogService } from "../log/log.service";
import { LogEntity } from "../log/log.entity";
import { CustomError } from "../error/customError";
import { FileService } from "../file/file.service";

@Injectable()
export class TrackService {
  private readonly containerName: string = 'tracks'
  
  constructor(
    @InjectRepository(TrackEntity) private readonly trackRepository: Repository<TrackEntity>,
    private readonly fileService: FileService,
    private readonly logService: LogService
  ) {}

  async find(id: string): Promise<TrackEntity> {
    return await this.trackRepository.findOneBy({ id });
  }

  async findAll(logId: string): Promise<TrackEntity[]> {
    try {
      const logEntity: LogEntity = await this.logService.find(logId);

      if (logEntity) {
        const tracks = await this.trackRepository.find({
          where: { log: 
            {
              id: logEntity.id
            } 
          },
        })

        return tracks;
      } else {
        throw new CustomError('Tracks not found', 'Not found', 404);
      }
    } catch (error) {
      throw error
    }
  }

  async create(logId: string, order: number, file: Express.Multer.File): Promise<InsertResult> {
    try {
      const logEntity: LogEntity = await this.logService.find(logId);

      if (logEntity) {
        const url = await this.fileService.uploadFile(file, this.containerName, logId);
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
      throw error;
    }
  }

  async update(id: string, track: TrackDto): Promise<UpdateResult> {
    return await this.trackRepository.update(id, track);
  }

  async downloadTrackFile(logId: string, fileName: string): Promise<string> {
    return await this.fileService.downloadFile(this.containerName, logId, fileName);
  }

  async delete(id: string, logId: string, fileName: string): Promise<DeleteResult> {
    try {
      await this.fileService.deleteFile(this.containerName, logId, fileName);

      return await this.trackRepository.delete({ id });
    } catch (error) {
      throw error
    }
  }
}