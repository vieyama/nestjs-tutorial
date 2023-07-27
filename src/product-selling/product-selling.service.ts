import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, SellProducts } from '@prisma/client';
import { omit } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

@Injectable()
export class ProductSellingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(createProducts: Prisma.SellProductsCreateManyInput[]) {
    try {
      const create = await this.prismaService.sellProducts.createMany({
        data: createProducts,
        skipDuplicates: true,
      });
      return {
        message: `Success insert ${create.count} of ${createProducts.length} products`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async createManyService(
    createProducts: Prisma.SellProductsUncheckedUpdateManyInput[],
  ) {
    const insert = createProducts
      .filter((item) => item.id === null)
      .map((data) => omit(data, 'id'));
    const update = createProducts.filter((item) => item.id !== null);

    const createMany = await this.prismaService.sellProducts.createMany({
      data: insert as Prisma.SellProductsCreateManyInput[],
    });

    const results = await Promise.all(
      update.map(
        (item) =>
          this.prismaService.sellProducts.update({
            where: { id: item.id as string },
            data: item,
          }),
        createMany,
      ), // returns an array of Promises
    );

    if (results) {
      return {
        message: `Success!`,
        status: HttpStatus.OK,
      };
    } else {
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateSellProduct: Prisma.SellProductsUpdateInput) {
    try {
      const res = await this.prismaService.sellProducts.update({
        where: {
          id,
        },
        data: updateSellProduct,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    const data = await this.prismaService.sellProducts.findUnique({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.BAD_GATEWAY);
    }
    try {
      await this.prismaService.sellProducts.delete({
        where: {
          id,
        },
      });

      return { message: 'Data deleted', status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async getAll(params: {
    page?: number;
    orderBy?: Prisma.ProductsOrderByWithRelationInput;
    where?: Prisma.ProductsWhereInput;
    perPage?: number;
    include?: object;
  }): Promise<PaginatedResult<SellProducts>> {
    const { page, where, orderBy, perPage } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.sellProducts,
      {
        where,
        orderBy,
      },
      {
        page,
        include: {
          customer: true,
          product: true,
          productInvoices: true,
          serviceInvoices: {
            select: {
              id: true,
              invoice_code: true,
              date_in: true,
              date_out: true,
              request_job: true,
              carId: true,
              status: true,
              cost_service: true,
              cost_product: true,
              transaction_type: true,
              tax: true,
              work_order_number: true,
              transfer_detail: true,
              payment_date: true,
              payment_method: true,
              payment_status: true,
              stay: true,
              number_queue: true,
              paid_total: true,
              paid_amount: true,
              foremanId: true,
              customerId: true,
              createdAt: true,
              updatedAt: true,
              SellProducts: {
                select: {
                  id: true,
                  qty: true,
                  selling_price: true,
                  is_guarantee: true,
                  discount: true,
                  productId: true,
                  customerId: true,
                  createdAt: true,
                  updatedAt: true,
                  customer: true,
                  product: true,
                  productInvoicesId: true,
                  serviceInvoicesId: true,
                },
              },
              SellServices: {
                select: {
                  id: true,
                  discount: true,
                  cost: true,
                  total_cost: true,
                  servicesId: true,
                  engineerId: true,
                  serviceInvoicesId: true,
                  createdAt: true,
                  updatedAt: true,
                  engineer: true,
                  service_invoice: true,
                  service_type: true,
                },
              },
              car: true,
              Customer: true,
              Foreman: true,
            },
          },
        },
      },
    );
  }
}
