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
  private readonly containerName: string = 'tracks'
  
  constructor(
    @InjectRepository(TrackEntity) private readonly trackRepository: Repository<TrackEntity>,
    private readonly fileService: FileService,
    private readonly logService: LogService
  ) {}

  async find(id: string): Promise<TrackEntity> {
    try {
      return await this.trackRepository.findOneBy({ id });
    } catch (error) {
      throw new CustomError('Track not found', 'Not found', 404)
    }
  }

  async findAll(logId: string): Promise<TrackEntity[]> {
    try {
      const logEntity: LogEntity = await this.logService.find(logId);

      if (logEntity) {
        console.log(logEntity)
        const tracks = await this.trackRepository.find({
          where: { log: 
            {
              id: logEntity.id
            } 
          },
        })

        console.log(tracks)
        return tracks;
      }
    } catch (error) {
      console.log(error)
      throw new CustomError('Tracks not found', 'Not found', 404);
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
      console.log(error)
      throw error;
    }
  }

  async update(id: string, track: TrackDto): Promise<UpdateResult> {
    try {
      return await this.trackRepository.update(id, track);
    } catch(error) {
      throw error
    }
  }

  async delete(id: string, logId: string, fileName: string): Promise<DeleteResult> {
    try {
      await this.fileService.deleteFile(this.containerName, logId, fileName);

      return await this.trackRepository.delete({ id });
    } catch (error) {
      throw error
    }
  }

  async downloadTrackFile(logId: string, fileName: string): Promise<string> {
    try {
      const downloadedFile: string = await this.fileService.downloadFile(this.containerName, logId, fileName);

      return downloadedFile;
    } catch (error) {
      throw error
    }
  }
}