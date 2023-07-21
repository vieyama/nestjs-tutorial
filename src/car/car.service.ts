import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Car, Prisma } from '@prisma/client';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

@Injectable()
export class CarService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCar: Prisma.CarCreateInput) {
    try {
      const create = await this.prismaService.car.create({
        data: createCar,
      });

      const data = await this.prismaService.car.findUnique({
        where: { id: create.id },
        include: {
          customer: true,
        },
      });

      return {
        data: data,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async createMany(createCars: Prisma.CarCreateManyInput[]) {
    try {
      const create = await this.prismaService.car.createMany({
        data: createCars,
        skipDuplicates: true,
      });
      return {
        message: `Success insert ${create.count} of ${createCars.length} cars`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(params: {
    page?: number;
    orderBy?: Prisma.CarOrderByWithRelationInput;
    where?: Prisma.CarWhereInput;
    perPage?: number;
    include?: object;
  }): Promise<PaginatedResult<Car>> {
    const { page, where, orderBy, perPage, include } = params;

    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.car,
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

  async findById(id: string) {
    try {
      const res = await this.prismaService.car.findUnique({
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

  async findByCustomerId(id: string) {
    try {
      const res = await this.prismaService.car.findMany({
        where: {
          customerId: id,
        },
        orderBy: {
          id: 'desc',
        },
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateCar: Prisma.CarUpdateInput) {
    try {
      const res = await this.prismaService.car.update({
        where: {
          id,
        },
        data: updateCar,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.car.delete({
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
