import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Prisma, Role, User } from '@prisma/client';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import * as dayjs from 'dayjs';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserService } from './user.service';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as argon from 'argon2';
import { PaginatedResult } from 'src/utils/paginator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: any) {
    return (
      'User-Id: ' +
      user?.userId +
      ' requested @ ' +
      dayjs(Date.now()).format('hh:m:s a')
    );
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('list')
  @Roles(Role.ADMIN)
  getUsers(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<User>> {
    const or = searchString
      ? {
          OR: [
            { email: { contains: searchString } },
            { role: { contains: searchString } },
          ],
        }
      : {};
    const where = {
      ...or,
    };
    return this.userService.getAll({
      page,
      orderBy: { [orderBy]: sort } || { id: 'asc' },
      where: where as Prisma.UserWhereInput,
      perPage,
    });
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('bulk-insert')
  @Roles(Role.ADMIN)
  async bulkInsert(@Body() createUserBody: AuthDto[]) {
    const password = await argon.hash('rahasia123');
    const dataUser = createUserBody.map((item) => {
      return {
        ...item,
        password,
      };
    });

    return this.userService.createMany(dataUser);
  }
}
