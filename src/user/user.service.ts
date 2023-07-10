import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { AuthDto } from 'src/auth/dto/auth.dto';
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

  async getById(id: number) {
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

  async createMany(createData: AuthDto[]) {
    try {
      const result = await this.prismaService.user.createMany({
        data: createData,
      });
      return result;
    } catch (error) {
      throw new HttpException('Duplicate item', HttpStatus.BAD_REQUEST);
    }
  }
}
