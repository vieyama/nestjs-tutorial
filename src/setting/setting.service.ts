import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SettingService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSettingDto: Prisma.SettingCreateInput) {
    try {
      const create = await this.prismaService.setting.create({
        data: createSettingDto,
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

  async findAll() {
    try {
      const res = await this.prismaService.setting.findMany();
      console.log(res);

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.prismaService.setting.findUnique({
        where: {
          id,
        },
      });
      console.log(res);

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateSettingDto: Prisma.SettingUpdateInput) {
    try {
      const res = await this.prismaService.setting.update({
        where: {
          id,
        },
        data: updateSettingDto,
      });

      return { data: res, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.setting.delete({
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
