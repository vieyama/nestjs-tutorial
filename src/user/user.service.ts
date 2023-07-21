import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { AuthBody } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(params: {
    page?: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    where?: Prisma.UserWhereInput;
    perPage?: number;
  }): Promise<PaginatedResult<User>> {
    const { page, where, orderBy, perPage } = params;
    const paginate: PaginateFunction = paginator({ perPage: perPage || 10 });

    return paginate(
      this.prismaService.user,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }

  async findOne(id: string) {
    try {
      const res = await this.prismaService.user.findUnique({
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

  async update(id: string, updateUser: Prisma.UserUpdateInput) {
    try {
      const res = await this.prismaService.user.update({
        where: {
          id,
        },
        data: updateUser,
      });
      const { password, ...result } = res;
      return { data: result, status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
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

  async createMany(createData: AuthBody[]) {
    try {
      const result = await this.prismaService.user.createMany({
        data: createData,
      });
      return result;
    } catch (error) {
      throw new HttpException('Duplicate item', HttpStatus.BAD_REQUEST);
    }
  }

  async create(createData: AuthBody) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: createData.email,
      },
    });

    if (user) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }
    try {
      const result = await this.prismaService.user.create({
        data: createData,
      });
      const { password, ...dataResult } = result;
      return dataResult;
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }
}
