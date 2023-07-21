import { Module } from '@nestjs/common';
import { ProductTransactionController } from './product-transaction.controller';
import { ProductTransactionService } from './product-transaction.service';

@Module({
  controllers: [ProductTransactionController],
  providers: [ProductTransactionService],
})
export class ProductTransactionModule {}
