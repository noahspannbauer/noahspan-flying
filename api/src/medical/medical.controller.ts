import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { MedicalService } from "./medical.service";
import { CustomError } from "src/error/customError";
import { MedicalDto } from "./medical.dto";
import { AuthGuard } from "@noahspan/noahspan-modules";


@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async find(@Param('id') id: string) {
    try {
      return await this.medicalService.find(id)
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      return await this.medicalService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() medicalDto: MedicalDto) {
    try {
      return await this.medicalService.create(medicalDto);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() medicalDto: MedicalDto) {
    try {
      return await this.medicalService.update(id, medicalDto);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.medicalService.delete(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}