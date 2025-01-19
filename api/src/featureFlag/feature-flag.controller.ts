import {
  Controller,
  Get,
  HttpException,
  Param,
} from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { CustomError, Public } from '@noahspan/noahspan-modules';

@Controller('featureFlags')
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  @Get(':partitionKey/:rowKey')
  @Public()
  async find(
    @Param('partitionKey') partitionKey: string,
    @Param('rowKey') rowKey: string
  ) {
    try {
      return await this.featureFlagService.find(partitionKey, rowKey);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get()
  @Public()
  async findAll() {
    try {
      return await this.featureFlagService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
