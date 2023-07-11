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
            { address: { contains: searchString } },
            { phone: { contains: searchString } },
            { bank_number: { contains: searchString } },
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

  @Post('upload/:user_id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          console.log(req.params.user_id);

          cb(null, `${req.params.user_id}-${file.originalname}`);
        },
      }),
    }),
  )
  async local(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: 200,
      data: file.path,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() userUpdate: Prisma.UserCreateInput,
  ) {
    console.log(userUpdate);

    const password = userUpdate.password
      ? await argon.hash(userUpdate.password)
      : undefined;

    return this.userService.update(id, {
      ...userUpdate,
      ...(password && { password }),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
