import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PurchaseProducts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';
import { InsertPurchaseProduct } from './types';
import { omit } from 'lodash';

@Injectable()
export class PurchaseProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProduct: InsertPurchaseProduct) {
    const product = await this.prismaService.products.findFirst({
      where: {
        code: { equals: createProduct.code },
      },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.CONFLICT);
    }

    const purchaseProduct = await this.prismaService.purchaseProducts.findFirst(
      {
        where: {
          invoice_code: {
            equals: createProduct.invoice_code,
          },
        },
      },
    );

    if (purchaseProduct) {
      throw new HttpException(
        'Invoice code already exist',
        HttpStatus.CONFLICT,
      );
    }

    const dataSave = omit(createProduct, ['code', 'edit_stock', 'edit_price']);
    const data = {
      ...dataSave,
      productId: product.id,
    } as Prisma.PurchaseProductsCreateInput;
    try {
      const [create, update] = await this.prismaService.$transaction([
        this.prismaService.purchaseProducts.create({
          data,
        }),
        this.prismaService.products.update({
          where: {
            id: product.id,
          },
          data: {
            ...(createProduct.edit_stock && {
              stock: product.stock + data.qty,
            }),
            ...(createProduct.edit_price && {
              purchase_price: data.purchase_price,
            }),
          },
        }),
      ]);
      return {
        data: { create, update },
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(params: {
    page?: number;
    orderBy?: Prisma.PurchaseProductsOrderByWithRelationInput;
    where?: Prisma.PurchaseProductsWhereInput;
    perPage?: number;
    include?: Prisma.PurchaseProductsInclude;
  }): Promise<PaginatedResult<PurchaseProducts>> {
    const { page, where, orderBy, perPage, include } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.purchaseProducts,
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
      const res = await this.prismaService.purchaseProducts.findUnique({
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

  async update(id: string, updateProduct: InsertPurchaseProduct) {
    const product = await this.prismaService.products.findFirst({
      where: {
        code: { equals: updateProduct.code },
      },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.CONFLICT);
    }

    const purchaseProduct =
      await this.prismaService.purchaseProducts.findUnique({
        where: {
          id,
        },
      });

    if (!purchaseProduct) {
      throw new HttpException(
        'Purchase Product not found',
        HttpStatus.CONFLICT,
      );
    }

    const dataSave = omit(updateProduct, ['code', 'edit_stock', 'edit_price']);
    const data = {
      ...dataSave,
      productId: product.id,
    } as Prisma.PurchaseProductsCreateInput;

    try {
      const [updatePurchase, editProduct] =
        await this.prismaService.$transaction([
          this.prismaService.purchaseProducts.update({ where: { id }, data }),
          this.prismaService.products.update({
            where: {
              id: product.id,
            },
            data: {
              ...(updateProduct.edit_stock && {
                stock: data.qty,
              }),
              ...(updateProduct.edit_price && {
                purchase_price: data.purchase_price,
              }),
            },
          }),
        ]);
      return {
        data: { updatePurchase, editProduct },
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.purchaseProducts.delete({
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
