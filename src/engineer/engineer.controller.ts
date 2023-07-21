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
import { EngineerService } from './engineer.service';
import { Engineer, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PaginatedResult } from 'src/utils/paginator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('engineer')
@UseGuards(JwtAuthGuard)
export class EngineerController {
  constructor(private readonly engineerService: EngineerService) {}

  @Post()
  create(@Body() createEngineer: Prisma.EngineerCreateInput) {
    return this.engineerService.create(createEngineer);
  }

  @Post('bulk-insert')
  createMany(@Body() createEngineer: Prisma.EngineerCreateInput[]) {
    return this.engineerService.createMany(createEngineer);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<Engineer>> {
    const include = {
      SellServices: true,
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

    return this.engineerService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.EngineerWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.engineerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() engineerUpdate: Prisma.EngineerCreateInput,
  ) {
    return this.engineerService.update(id, engineerUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.engineerService.remove(id);
  }
}
