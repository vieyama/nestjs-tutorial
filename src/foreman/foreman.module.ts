import { Module } from '@nestjs/common';
import { ForemanController } from './foreman.controller';
import { ForemanService } from './foreman.service';

@Module({
  controllers: [ForemanController],
  providers: [ForemanService],
})
export class ForemanModule {}
