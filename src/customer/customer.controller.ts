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
import { CustomerService } from './customer.service';
import { Customer, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PaginatedResult } from 'src/utils/paginator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomer: Prisma.CustomerCreateInput) {
    return this.customerService.create(createCustomer);
  }

  @Post('bulk-insert')
  createMany(@Body() createCustomer: Prisma.CustomerCreateInput[]) {
    return this.customerService.createMany(createCustomer);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<Customer>> {
    const include = {
      Car: true,
      SellProducts: true,
      ServiceInvoices: true,
    };

    const or = searchString
      ? {
          OR: [
            { name: { contains: searchString } },
            { address: { contains: searchString } },
            { phone: { contains: searchString } },
            { bank_number: { contains: searchString } },
          ],
        }
      : {};
    const where = {
      ...or,
    };

    return this.customerService.findAll({
      page,
      orderBy: { [orderBy]: sort } || { id: 'asc' },
      where: where as Prisma.CustomerWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() customerUpdate: Prisma.CustomerCreateInput,
  ) {
    return this.customerService.update(id, customerUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
