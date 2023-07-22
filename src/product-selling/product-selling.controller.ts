import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  SellProducts,
} from '@prisma/client';
import { ProductSellingService } from './product-selling.service';
import { PaginatedResult } from 'src/utils/paginator';
import * as dayjs from 'dayjs';

@ApiBearerAuth()
@Controller('product-selling')
@UseGuards(JwtAuthGuard)
export class ProductSellingController {
  constructor(private readonly productSellingService: ProductSellingService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('search') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('start-date') startDate?: string,
    @Query('end-date') endDate?: string,
    @Query('payment-method') paymentMethod?: PaymentMethod,
    @Query('payment-status') paymentStatus?: PaymentStatus,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('guarantee') guarantee?: boolean,
    @Query('product-only') productOnly?: boolean,
  ): Promise<PaginatedResult<SellProducts>> {
    const dateAddDay = dayjs(endDate).add(1, 'day');
    const startDateFilter = startDate
      ? new Date(startDate).toISOString()
      : undefined;

    const endDateFilter = endDate
      ? new Date(dateAddDay.format('YYYY-MM-DD')).toISOString()
      : undefined;

    const where = {
      AND: {
        ...(startDate &&
          endDate && {
            date_in: {
              gte: startDateFilter,
              lte: endDateFilter,
            },
          }),

        ...(!!guarantee && {
          is_guarantee: true,
        }),
        ...(!!productOnly && {
          NOT: {
            productInvoicesId: null,
          },
        }),
        ...(!productOnly && {
          NOT: {
            serviceInvoicesId: null,
          },
        }),
        OR: [
          { productInvoices: { invoice_code: { contains: searchString } } },
          { serviceInvoices: { invoice_code: { contains: searchString } } },
          { customer: { name: { contains: searchString } } },
          { product: { name: { contains: searchString } } },
        ],
        ...(paymentStatus && {
          payment_status: {
            equals: paymentStatus,
          },
        }),
        ...(paymentMethod && {
          payment_method: {
            equals: paymentMethod,
          },
        }),
      },
    };

    return this.productSellingService.getAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.ProductsWhereInput,
      perPage,
    });
  }

  @Post('bulk-insert')
  insertSeliing(@Body() reqBody: Prisma.SellProductsCreateManyInput[]) {
    return this.productSellingService.createMany(reqBody);
  }

  @Post('bulk-insert-service')
  insertSeliingService(
    @Body() reqBody: Prisma.SellProductsUncheckedUpdateManyInput[],
  ) {
    return this.productSellingService.createManyService(reqBody);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Prisma.SellProductsUpdateInput,
  ) {
    return this.productSellingService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSellingService.remove(id);
  }
}
