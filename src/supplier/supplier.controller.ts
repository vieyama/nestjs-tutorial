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
import { Prisma, Supplier } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PaginatedResult } from 'src/utils/paginator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';

@ApiBearerAuth()
@Controller('supplier')
@UseGuards(JwtAuthGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createSupplier: Prisma.SupplierCreateInput) {
    return this.supplierService.create(createSupplier);
  }

  @Post('bulk-insert')
  createMany(@Body() createSupplier: Prisma.SupplierCreateInput[]) {
    return this.supplierService.createMany(createSupplier);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<Supplier>> {
    const include = {
      Products: true,
    };

    const or = searchString
      ? {
          OR: [
            { name: { contains: searchString } },
            { address: { contains: searchString } },
            { phone: { contains: searchString } },
            { bank_number: { contains: searchString } },
            { company: { contains: searchString } },
          ],
        }
      : {};
    const where = {
      ...or,
    };

    return this.supplierService.findAll({
      page,
      orderBy: { [orderBy]: sort } || { id: 'asc' },
      where: where as Prisma.SupplierWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() supplierUpdate: Prisma.SupplierUpdateInput,
  ) {
    return this.supplierService.update(id, supplierUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
