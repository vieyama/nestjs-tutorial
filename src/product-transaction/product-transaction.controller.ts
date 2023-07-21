import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ProductTransactionService } from './product-transaction.service';
import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ProductInvoices,
} from '@prisma/client';
import { PaginatedResult } from 'src/utils/paginator';
import * as dayjs from 'dayjs';
import { isEmpty } from 'lodash';

@ApiBearerAuth()
@Controller('product-transaction')
@UseGuards(JwtAuthGuard)
export class ProductTransactionController {
  constructor(
    private readonly productTransactionService: ProductTransactionService,
  ) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('search') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('start-date') startDate?: string,
    @Query('payment-method') paymentMethod?: PaymentMethod,
    @Query('payment-status') paymentStatus?: PaymentStatus,
    @Query('end-date') endDate?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<ProductInvoices>> {
    const filter = [];

    const include = {
      SellProducts: true,
    };

    const dateAddDay = dayjs(endDate).add(1, 'day');
    const startDateFilter = startDate
      ? new Date(startDate).toISOString()
      : undefined;

    const endDateFilter = endDate
      ? new Date(dateAddDay.format('YYYY-MM-DD')).toISOString()
      : undefined;

    const dateFilter = {
      transaction_date: {
        gte: startDateFilter,
        lte: endDateFilter,
      },
    };

    const paymentMethodFilter = {
      payment_method: {
        equals: paymentMethod,
      },
    };

    const paymentStatusFilter = {
      payment_status: {
        equals: paymentStatus,
      },
    };

    if (startDate && endDate) {
      filter.push(dateFilter);
    }

    if (searchString) {
      filter.push({ invoice_code: { contains: searchString } });
    }

    if (paymentMethod) {
      filter.push(paymentMethodFilter);
    }

    if (paymentStatus) {
      filter.push(paymentStatusFilter);
    }

    const where = {
      ...(!isEmpty(filter) && { OR: filter }),
    };

    return this.productTransactionService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.ProductsWhereInput,
      perPage,
      include,
    });
  }

  @Get('latest')
  getLatestTransaction() {
    return this.productTransactionService.getLatest();
  }

  @Patch(':invoice_code')
  update(
    @Param('invoice_code') invoiceCode: string,
    @Body() updateProductDto: Prisma.ProductInvoicesUpdateInput,
  ) {
    return this.productTransactionService.update(invoiceCode, updateProductDto);
  }

  @Post()
  insertTransaction(@Body() reqBody: Prisma.ProductInvoicesCreateInput) {
    return this.productTransactionService.create(reqBody);
  }
}
