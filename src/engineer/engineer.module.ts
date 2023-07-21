import { Module } from '@nestjs/common';
import { EngineerController } from './engineer.controller';
import { EngineerService } from './engineer.service';

@Module({
  controllers: [EngineerController],
  providers: [EngineerService],
})
export class EngineerModule {}
