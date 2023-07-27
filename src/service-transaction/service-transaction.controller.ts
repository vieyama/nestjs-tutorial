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
import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ServiceInvoices,
  StatusService,
} from '@prisma/client';
import { ServiceTransactionService } from './service-transaction.service';
import { PaginatedResult } from 'src/utils/paginator';
import * as dayjs from 'dayjs';

@ApiBearerAuth()
@Controller('service-transaction')
@UseGuards(JwtAuthGuard)
export class ServiceTransactionController {
  constructor(
    private readonly serviceTransactionService: ServiceTransactionService,
  ) {}

  @Get('latest')
  getLatestTransaction() {
    return this.serviceTransactionService.getLatest();
  }

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
    @Query('status') status?: StatusService,
    @Query('today') today?: boolean,
    @Query('stay') stay?: boolean,
    @Query('report') report?: boolean,
    @Query('product-report') productReport?: boolean,
  ): Promise<PaginatedResult<ServiceInvoices>> {
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

    const where = {
      AND: {
        ...(startDate &&
          endDate && {
            date_in: {
              gte: startDateFilter,
              lte: endDateFilter,
            },
          }),
        ...(!!productReport && {
          cost_product: {
            not: null,
          },
        }),
        ...(!!today && {
          status: {
            not: 'DONE',
          },
          stay: false,
        }),
        ...(!!report && {
          status: {
            equals: 'DONE',
          },
        }),
        ...(!!stay && {
          status: {
            not: 'DONE',
          },
          stay: true,
        }),
        ...(!!searchString && {
          OR: [
            { invoice_code: { contains: searchString } },
            { work_order_number: { contains: searchString } },
            { Customer: { name: { contains: searchString } } },
            { car: { plat_number: { contains: searchString } } },
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

    return this.serviceTransactionService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.ProductsWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceTransactionService.getById(id);
  }

  @Post()
  insertTransaction(@Body() reqBody: Prisma.ServiceInvoicesCreateInput) {
    return this.serviceTransactionService.create(reqBody);
  }

  @Patch(':id')
  update(
    @Param('id') invoiceId: string,
    @Body() updateServiceDto: Prisma.ServiceInvoicesUpdateInput,
  ) {
    return this.serviceTransactionService.update(invoiceId, updateServiceDto);
  }
}
