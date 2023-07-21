import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceSellingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(createService: Prisma.SellServicesCreateManyInput[]) {
    try {
      const create = await this.prismaService.sellServices.createMany({
        data: createService,
        skipDuplicates: true,
      });
      return {
        message: `Success insert ${create.count} of ${createService.length} services`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateSellServices: Prisma.SellServicesUpdateInput) {
    try {
      const res = await this.prismaService.sellServices.update({
        where: {
          id,
        },
        data: updateSellServices,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.sellServices.delete({
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
