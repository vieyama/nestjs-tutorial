import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Engineer, Prisma } from '@prisma/client';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

@Injectable()
export class EngineerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEngineer: Prisma.EngineerCreateInput) {
    try {
      const create = await this.prismaService.engineer.create({
        data: createEngineer,
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

  async createMany(createEngineers: Prisma.EngineerCreateInput[]) {
    try {
      const create = await this.prismaService.engineer.createMany({
        data: createEngineers,
        skipDuplicates: true,
      });
      return {
        message: `Success insert ${create.count} of ${createEngineers.length} engineers`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(params: {
    page?: number;
    orderBy?: Prisma.EngineerOrderByWithRelationInput;
    where?: Prisma.EngineerWhereInput;
    perPage?: number;
    include?: object;
  }): Promise<PaginatedResult<Engineer>> {
    const { page, where, orderBy, perPage, include } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.engineer,
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
      const res = await this.prismaService.engineer.findUnique({
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

  async update(id: string, updateEngineer: Prisma.EngineerUpdateInput) {
    try {
      const res = await this.prismaService.engineer.update({
        where: {
          id,
        },
        data: updateEngineer,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.engineer.delete({
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
