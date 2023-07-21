import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, ProductInvoices } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

const include = {
  SellProducts: {
    select: {
      id: true,
      qty: true,
      selling_price: true,
      is_guarantee: true,
      discount: true,
      product: {
        select: {
          id: true,
          code: true,
          name: true,
          brand: true,
          location: true,
          purchase_price: true,
          selling_price: true,
          product_type: true,
          stock: true,
          min_stock_alert: true,
        },
      },
      productId: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

@Injectable()
export class ProductTransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLatest() {
    try {
      const data = await this.prismaService.productInvoices.findFirst({
        orderBy: { createdAt: 'desc' },
        include,
      });
      return { data, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async create(createProductTransaction: Prisma.ProductInvoicesCreateInput) {
    const product = await this.prismaService.productInvoices.findUnique({
      where: {
        invoice_code: createProductTransaction.invoice_code,
      },
    });

    if (product) {
      throw new HttpException(
        'Invoice Code already exist',
        HttpStatus.CONFLICT,
      );
    }

    try {
      const create = await this.prismaService.productInvoices.create({
        data: createProductTransaction,
      });
      return {
        data: create,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(
    invoiceId: string,
    updateProductInv: Prisma.ProductInvoicesUpdateInput,
  ) {
    try {
      await this.prismaService.productInvoices.update({
        where: {
          invoice_code: invoiceId,
        },
        data: updateProductInv,
      });

      const data = await this.prismaService.productInvoices.findFirst({
        where: {
          invoice_code: { equals: invoiceId },
        },
        include,
      });
      return { data, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(params: {
    page?: number;
    orderBy?: Prisma.ProductsOrderByWithRelationInput;
    where?: Prisma.ProductsWhereInput;
    perPage?: number;
    include?: object;
  }): Promise<PaginatedResult<ProductInvoices>> {
    const { page, where, orderBy, perPage } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.productInvoices,
      {
        where,
        orderBy,
      },
      {
        page,
        include,
      },
    );
  }
}
