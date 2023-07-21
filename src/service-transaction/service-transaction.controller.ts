import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Prisma } from '@prisma/client';
import { ServiceTransactionService } from './service-transaction.service';

@ApiBearerAuth()
@Controller('service-transaction')
@UseGuards(JwtAuthGuard)
export class ServiceTransactionController {
  constructor(
    private readonly serviceTransactionService: ServiceTransactionService,
  ) {}

  @Get('latest')
  getLatestTransaction() {
    return this.serviceTransactionService.getLatest();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceTransactionService.getById(id);
  }

  @Post()
  insertTransaction(@Body() reqBody: Prisma.ServiceInvoicesCreateInput) {
    return this.serviceTransactionService.create(reqBody);
  }

  @Patch(':id')
  update(
    @Param('id') invoiceId: string,
    @Body() updateServiceDto: Prisma.ServiceInvoicesUpdateInput,
  ) {
    return this.serviceTransactionService.update(invoiceId, updateServiceDto);
  }
}
