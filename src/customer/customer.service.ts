import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer, Prisma } from '@prisma/client';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCustomer: Prisma.CustomerCreateInput) {
    try {
      const create = await this.prismaService.customer.create({
        data: createCustomer,
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

  async createMany(createCustomers: Prisma.CustomerCreateInput[]) {
    try {
      const create = await this.prismaService.customer.createMany({
        data: createCustomers,
        skipDuplicates: true,
      });
      return {
        message: `Success insert ${create.count} of ${createCustomers.length} customers`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(params: {
    page?: number;
    orderBy?: Prisma.CustomerOrderByWithRelationInput;
    where?: Prisma.CustomerWhereInput;
    perPage?: number;
    include?: object;
  }): Promise<PaginatedResult<Customer>> {
    const { page, where, orderBy, perPage, include } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.customer,
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

  async findOne(id: string) {
    try {
      const res = await this.prismaService.customer.findUnique({
        where: {
          id,
        },
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateCustomer: Prisma.CustomerUpdateInput) {
    try {
      const res = await this.prismaService.customer.update({
        where: {
          id,
        },
        data: updateCustomer,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.customer.delete({
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
}
