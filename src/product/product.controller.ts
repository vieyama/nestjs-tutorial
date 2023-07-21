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
import { ProductService } from './product.service';
import { Prisma, ProductType, Products } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PaginatedResult } from 'src/utils/paginator';

@ApiBearerAuth()
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Prisma.ProductsCreateInput) {
    return this.productService.create(createProductDto);
  }

  @Post('bulk-insert')
  createMany(@Body() createProducts: Prisma.ProductsCreateManyInput[]) {
    return this.productService.createMany(createProducts);
  }

  @Patch('bulk-update')
  updateMany(@Body() updateProducts: Prisma.ProductsUpdateManyMutationInput[]) {
    return this.productService.updateMany(updateProducts);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('type') type?: ProductType,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<Products>> {
    const include = {
      supplier: true,
    };

    const or = searchString
      ? {
          product_type: {
            equals: type,
          },
          OR: [
            { code: { contains: searchString } },
            { name: { contains: searchString } },
            { brand: { contains: searchString } },
            { location: { contains: searchString } },
            {
              supplier: {
                name: {
                  contains: searchString,
                },
              },
            },
          ],
        }
      : {
          ...(type && {
            product_type: {
              equals: type,
            },
          }),
        };
    const where = {
      ...or,
    };

    return this.productService.findAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.ProductsWhereInput,
      perPage,
      include,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Prisma.ProductsUpdateInput,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
