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
import { PurchaseProductService } from './purchase-product.service';
import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PurchaseProducts,
} from '@prisma/client';
import { PaginatedResult } from 'src/utils/paginator';
import * as dayjs from 'dayjs';
import { InsertPurchaseProduct } from './types';

@ApiBearerAuth()
@Controller('purchase-product')
@UseGuards(JwtAuthGuard)
export class PurchaseProductController {
  constructor(private readonly purchaseService: PurchaseProductService) {}

  @Post()
  async create(@Body() createPurchase: InsertPurchaseProduct) {
    return this.purchaseService.create(createPurchase);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('start-date') startDate?: string,
    @Query('end-date') endDate?: string,
    @Query('payment-method') paymentMethod?: PaymentMethod,
    @Query('payment-status') paymentStatus?: PaymentStatus,
  ): Promise<PaginatedResult<PurchaseProducts>> {
    const include = {
      supplier: true,
      product: true,
    };

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
            purchase_date: {
              gte: startDateFilter,
              lte: endDateFilter,
            },
          }),

        ...(!!searchString && {
          OR: [
            { invoice_code: { contains: searchString } },
            { product: { name: { contains: searchString } } },
            { supplier: { name: { contains: searchString } } },
          ],
        }),
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

    return this.purchaseService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.PurchaseProductsWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: InsertPurchaseProduct,
  ) {
    return this.purchaseService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }
}
