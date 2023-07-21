import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Services } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

@Injectable()
export class ServicesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createService: Prisma.ServicesCreateInput) {
    const product = await this.prismaService.services.findUnique({
      where: {
        code: createService.code,
      },
    });

    if (product) {
      throw new HttpException('Code already exist', HttpStatus.CONFLICT);
    }

    try {
      const create = await this.prismaService.services.create({
        data: createService,
      });
      return {
        data: create,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async createMany(createServices: Prisma.ServicesCreateManyInput[]) {
    try {
      const create = await this.prismaService.services.createMany({
        data: createServices,
        skipDuplicates: true,
      });
      return {
        message: `Success insert ${create.count} of ${createServices.length} services`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(params: {
    page?: number;
    orderBy?: Prisma.ServicesOrderByWithRelationInput;
    where?: Prisma.ServicesWhereInput;
    perPage?: number;
    include?: object;
  }): Promise<PaginatedResult<Services>> {
    const { page, where, orderBy, perPage, include } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.services,
      {
        where,
        orderBy,
      },
      {
        page,
        include,
      },
    );
  }

  async findOne(id: string) {
    try {
      const res = await this.prismaService.services.findUnique({
        where: {
          id,
        },
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateService: Prisma.ServicesUpdateInput) {
    try {
      const res = await this.prismaService.services.update({
        where: {
          id,
        },
        data: updateService,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.services.delete({
        where: {
          id,
        },
      });

      return { message: 'Data deleted', status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }
}
