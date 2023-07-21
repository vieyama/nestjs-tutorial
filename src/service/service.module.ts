import { Module } from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServiceController } from './service.controller';

@Module({
  controllers: [ServiceController],
  providers: [ServicesService],
})
export class ServiceModule {}
