import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ForemanService } from './foreman.service';
import { Foreman, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PaginatedResult } from 'src/utils/paginator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('foreman')
@UseGuards(JwtAuthGuard)
export class ForemanController {
  constructor(private readonly foremanService: ForemanService) {}

  @Post()
  create(@Body() createForeman: Prisma.ForemanCreateInput) {
    return this.foremanService.create(createForeman);
  }

  @Post('bulk-insert')
  createMany(@Body() createForeman: Prisma.ForemanCreateInput[]) {
    return this.foremanService.createMany(createForeman);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<Foreman>> {
    const include = {
      ServiceInvoices: true,
    };

    const or = searchString
      ? {
          OR: [
            { name: { contains: searchString } },
            { address: { contains: searchString } },
            { phone: { contains: searchString } },
            { bank_number: { contains: searchString } },
          ],
        }
      : {};
    const where = {
      ...or,
    };

    return this.foremanService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.ForemanWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foremanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() foremanUpdate: Prisma.ForemanCreateInput,
  ) {
    return this.foremanService.update(id, foremanUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foremanService.remove(id);
  }
}
