import { Module } from '@nestjs/common';
import { PurchaseProductService } from './purchase-product.service';
import { PurchaseProductController } from './purchase-product.controller';

@Module({
  providers: [PurchaseProductService],
  controllers: [PurchaseProductController],
})
export class PurchaseProductModule {}
