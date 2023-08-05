import { Prisma } from '@prisma/client';

export interface InsertPurchaseProduct
  extends Prisma.PurchaseProductsCreateInput {
  edit_price: boolean;
  edit_stock: boolean;
  supplierId?: string;
  code?: string;
}
