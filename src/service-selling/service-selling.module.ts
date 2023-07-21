import { Module } from '@nestjs/common';
import { ServiceSellingController } from './service-selling.controller';
import { ServiceSellingService } from './service-selling.service';

@Module({
  controllers: [ServiceSellingController],
  providers: [ServiceSellingService],
})
export class ServiceSellingModule {}
