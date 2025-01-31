import {
  Controller,
  Get,
  HttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { CustomError } from '../error/customError';
import { AuthGuard } from '@nestjs/passport';

@Controller('featureFlags')
@UseGuards(AuthGuard('azure-ad'))
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  @Get(':partitionKey/:rowKey')
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
  async findAll() {
    try {
      return await this.featureFlagService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
