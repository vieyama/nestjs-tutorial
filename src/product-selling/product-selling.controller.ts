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
import { ProductSellingService } from './product-selling.service';

@ApiBearerAuth()
@Controller('product-selling')
@UseGuards(JwtAuthGuard)
export class ProductSellingController {
  constructor(private readonly productSellingService: ProductSellingService) {}

  @Post('bulk-insert')
  insertSeliing(@Body() reqBody: Prisma.SellProductsCreateManyInput[]) {
    return this.productSellingService.createMany(reqBody);
  }

  @Post('bulk-insert-service')
  insertSeliingService(
    @Body() reqBody: Prisma.SellProductsUncheckedUpdateManyInput[],
  ) {
    return this.productSellingService.createManyService(reqBody);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Prisma.SellProductsUpdateInput,
  ) {
    return this.productSellingService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSellingService.remove(id);
  }
}
