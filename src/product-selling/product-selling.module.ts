import { Module } from '@nestjs/common';
import { ProductSellingController } from './product-selling.controller';
import { ProductSellingService } from './product-selling.service';

@Module({
  controllers: [ProductSellingController],
  providers: [ProductSellingService],
})
export class ProductSellingModule {}
