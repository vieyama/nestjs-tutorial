import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBody } from './dto/auth.dto';
import { IRequestWithUser } from './interfaces/IRequestWithUser';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: AuthBody) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  async signIn(@Body() dto: AuthBody) {
    const tokens = await this.authService.signIn(dto);
    return tokens;
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Req() request: IRequestWithUser) {
    const tokenId = request.header('Token-Id');

    await this.authService.signOut(tokenId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: IRequestWithUser) {
    return request.user;
  }
}
