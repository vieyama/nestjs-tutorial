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
import { CarService } from './car.service';
import { Car, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PaginatedResult } from 'src/utils/paginator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('car')
@UseGuards(JwtAuthGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() createCar: Prisma.CarCreateInput) {
    return this.carService.create(createCar);
  }

  @Post('bulk-insert')
  createMany(@Body() createCar: Prisma.CarCreateManyInput[]) {
    return this.carService.createMany(createCar);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('search') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<Car>> {
    const include = {
      ServiceInvoices: true,
      customer: true,
    };

    const or = searchString
      ? {
          OR: [
            { model: { contains: searchString } },
            { plat_number: { contains: searchString } },
          ],
        }
      : {};
    const where = {
      ...or,
    };

    return this.carService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.CarWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findById(id);
  }

  @Get('customer/:user_id')
  findOneByUserId(@Param('user_id') customerId: string) {
    return this.carService.findByCustomerId(customerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() carUpdate: Prisma.CarCreateInput) {
    return this.carService.update(id, carUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
