import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServicesService } from './service.service';
import { Prisma, Services } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PaginatedResult } from 'src/utils/paginator';

@ApiBearerAuth()
@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: Prisma.ServicesCreateInput) {
    return this.serviceService.create(createServiceDto);
  }

  @Post('bulk-insert')
  createMany(@Body() createServices: Prisma.ServicesCreateManyInput[]) {
    return this.serviceService.createMany(createServices);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<Services>> {
    const include = {};

    const or = searchString
      ? {
          OR: [
            { code: { contains: searchString } },
            { name: { contains: searchString } },
          ],
        }
      : {};
    const where = {
      ...or,
    };

    return this.serviceService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.ServicesWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: Prisma.ServicesUpdateInput,
  ) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}
