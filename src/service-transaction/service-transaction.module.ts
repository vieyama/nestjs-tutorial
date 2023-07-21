import { Module } from '@nestjs/common';
import { ServiceTransactionController } from './service-transaction.controller';
import { ServiceTransactionService } from './service-transaction.service';

@Module({
  controllers: [ServiceTransactionController],
  providers: [ServiceTransactionService],
})
export class ServiceTransactionModule {}
