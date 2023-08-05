import { Injectable } from '@nestjs/common';
import { sum } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAnalytic() {
    const selledProductQuery = this.prismaService.productInvoices.findMany({
      where: {
        payment_status: {
          equals: 'PAID',
        },
      },
      include: {
        SellProducts: true,
      },
    });

    const selledServiceQuery = this.prismaService.serviceInvoices.findMany({
      where: {
        payment_status: {
          equals: 'PAID',
        },
      },
      include: {
        SellProducts: true,
        SellServices: true,
      },
    });

    const purchaseProductQuery = this.prismaService.purchaseProducts.findMany({
      where: {
        payment_status: {
          equals: 'PAID',
        },
      },
    });

    const totalServiceQuery = this.prismaService.serviceInvoices.count();

    const [selledProduct, selledService, totalService, purchaseProduct] =
      await this.prismaService.$transaction([
        selledProductQuery,
        selledServiceQuery,
        totalServiceQuery,
        purchaseProductQuery,
      ]);

    const totalSelledProduct = sum(
      selledProduct
        .flatMap((item) => item.SellProducts)
        .map((item) => item.qty),
    );

    const totalSelledProductFromService = sum(
      selledService
        .flatMap((item) => item.SellProducts)
        .map((item) => item.qty),
    );

    const totalIncomeProduct = sum(
      selledProduct.map((item) => item.paid_amount - item.discount),
    );
    const totalIncomeProductFromService = sum(
      selledService.map((item) => item.cost_product),
    );

    const totalIncomeService = sum(
      selledService.map((item) => item.cost_service),
    );

    const totalProductTax = sum(
      selledProduct.map((item) => item.paid_amount * (item.tax / 100)),
    );
    const totalServiceTax = sum(
      selledService.map((item) => item.paid_amount * (item.tax / 100)),
    );

    const totalPurchase = sum(
      purchaseProduct.map((item) => item.qty * item.purchase_price),
    );

    return {
      data: {
        totalSellingProduct: totalSelledProductFromService + totalSelledProduct,
        totalService,
        totalFinishService: selledService.length,
        totalIncomeProduct: totalIncomeProduct + totalIncomeProductFromService,
        totalIncomeService,
        totalIncome:
          totalIncomeProduct +
          totalIncomeProductFromService +
          totalIncomeService,
        totalTax: totalProductTax + totalServiceTax,
        totalPurchase,
      },
    };
  }
}
