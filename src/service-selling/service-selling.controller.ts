import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Prisma } from '@prisma/client';
import { ServiceSellingService } from './service-selling.service';

@ApiBearerAuth()
@Controller('service-selling')
@UseGuards(JwtAuthGuard)
export class ServiceSellingController {
  constructor(private readonly serviceSellingService: ServiceSellingService) {}

  @Post('bulk-insert')
  insertSeliing(@Body() reqBody: Prisma.SellServicesCreateManyInput[]) {
    return this.serviceSellingService.createMany(reqBody);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Prisma.SellServicesUpdateInput,
  ) {
    return this.serviceSellingService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceSellingService.remove(id);
  }
}
