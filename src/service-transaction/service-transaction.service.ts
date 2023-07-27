import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, ServiceInvoices } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

const include = {
  car: {
    select: {
      id: true,
      model: true,
      plat_number: true,
      color: true,
      mileage: true,
      chassis_number: true,
      engine_number: true,
      customerId: true,
      createdAt: true,
      updatedAt: true,
      customer: true,
    },
  },
  Customer: true,
  Foreman: true,
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
};

@Injectable()
export class ServiceTransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLatest() {
    try {
      const data = await this.prismaService.serviceInvoices.findFirst({
        orderBy: { createdAt: 'desc' },
        include,
      });
      return { data, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async getById(id: string) {
    try {
      const data = await this.prismaService.serviceInvoices.findUnique({
        where: {
          id,
        },
        include,
      });
      return { data, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async create(createServiceTransaction: Prisma.ServiceInvoicesCreateInput) {
    const service = await this.prismaService.serviceInvoices.findFirst({
      where: {
        invoice_code: createServiceTransaction.invoice_code,
      },
    });

    if (service) {
      throw new HttpException(
        'Invoice Code already exist',
        HttpStatus.CONFLICT,
      );
    }

    try {
      const create = await this.prismaService.serviceInvoices.create({
        data: createServiceTransaction,
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
    updateServiceInv: Prisma.ServiceInvoicesUpdateInput,
  ) {
    try {
      await this.prismaService.serviceInvoices.update({
        where: {
          id: invoiceId,
        },
        data: updateServiceInv,
      });

      const data = await this.prismaService.serviceInvoices.findFirst({
        where: {
          id: invoiceId,
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
  }): Promise<PaginatedResult<ServiceInvoices>> {
    const { page, where, orderBy, perPage } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.serviceInvoices,
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
