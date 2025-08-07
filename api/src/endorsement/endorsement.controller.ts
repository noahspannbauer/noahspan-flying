import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from "@nestjs/common";
import { EndorsementService } from "./endorsement.service";
import { CustomError } from "@noahspan/noahspan-modules";
import { EndorsementDto } from "./endorsement.dto";


@Controller('endorsements')
export class EndorsementController {
  constructor(private readonly endorsementService: EndorsementService) {}

  @Get(':id')
  async find(@Param('id') id: string) {
    try {
      return await this.endorsementService.find(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.endorsementService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Post()
  async create(@Body() endorsementDto: EndorsementDto) {
    try {
      return await this.endorsementService.create(endorsementDto);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() endorsementDto: EndorsementDto) {
    try {
      return await this.endorsementService.update(id, endorsementDto);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode)
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.endorsementService.delete(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode)
    }
  }
}