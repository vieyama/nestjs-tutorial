import { Roles } from './../auth/decorator/roles.decorator';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Prisma, User } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';
import { PaginatedResult } from 'src/utils/paginator';
import * as argon from 'argon2';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthBody } from 'src/auth/dto/auth.dto';

@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: string,
    @Query('perPage') perPage?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PaginatedResult<User>> {
    const or = searchString
      ? {
          OR: [
            { name: { contains: searchString } },
            { email: { contains: searchString } },
          ],
        }
      : {};
    const where = {
      ...or,
    };

    return this.userService.getAll({
      page,
      orderBy: orderBy ? { [orderBy]: sort } : { createdAt: 'desc' },
      where: where as Prisma.UserWhereInput,
      perPage,
    });
  }

  @Post('upload/:user_id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: 'public/avatar',
        filename: (req, file, cb) => {
          cb(null, `${req.params.user_id}-${file.originalname}`);
        },
      }),
    }),
  )
  async local(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: 200,
      url: file.path,
      fileName: file.filename,
    };
  }

  @Post('check-password/:user_id')
  async checkPassword(
    @Param('user_id') id: string,
    @Body() checkBody: { password: string },
  ) {
    const user = await this.userService.getById(id);
    const isMatch = await argon.verify(user.password, checkBody.password);
    return {
      verification: isMatch,
    };
  }

  @Roles('SUPERADMIN')
  @Post()
  async insertAdmin(@Body() userCreate: AuthBody) {
    const password = await argon.hash(userCreate.password as string);

    return this.userService.create({
      ...userCreate,
      password,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() userUpdate: Prisma.UserUpdateInput,
  ) {
    const password = userUpdate.password
      ? await argon.hash(userUpdate.password as string)
      : undefined;

    return this.userService.update(id, {
      ...userUpdate,
      ...(password && { password }),
    });
  }

  @Roles('SUPERADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
