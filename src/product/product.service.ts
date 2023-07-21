import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Products } from '@prisma/client';
import { omit } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProduct: Prisma.ProductsCreateInput) {
    const product = await this.prismaService.products.findUnique({
      where: {
        code: createProduct.code,
      },
    });

    if (product) {
      throw new HttpException('Code already exist', HttpStatus.CONFLICT);
    }

    try {
      const create = await this.prismaService.products.create({
        data: createProduct,
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

  async createMany(createProducts: Prisma.ProductsCreateManyInput[]) {
    try {
      const create = await this.prismaService.products.createMany({
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

  async updateMany(updateProducts: Prisma.ProductsUpdateManyMutationInput[]) {
    const promises = [];

    try {
      for (let i = 0; i < updateProducts.length; i++) {
        const recordProduct = this.prismaService.products.update({
          where: { id: updateProducts[i].id as string },
          data: omit(updateProducts[i], 'id'),
        });
        // add the promise to the promises array
        promises.push(recordProduct);
      }
      await this.prismaService.$transaction(promises, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      });
      return {
        message: `Success update ${updateProducts.length} products`,
        status: HttpStatus.OK,
      };
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
  }): Promise<PaginatedResult<Products>> {
    const { page, where, orderBy, perPage, include } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.products,
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
      const res = await this.prismaService.products.findUnique({
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

  async update(id: string, updateProduct: Prisma.ProductsUpdateInput) {
    try {
      const res = await this.prismaService.products.update({
        where: {
          id,
        },
        data: updateProduct,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.products.delete({
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
