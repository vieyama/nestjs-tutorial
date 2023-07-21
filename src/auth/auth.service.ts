import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthBody } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from './interfaces/ITokenPayload';

import * as dayjs from 'dayjs';

import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const JWT_ACCESS_TOKEN_EXPIRATION_TIME = '1d';
const JWT_REFRESH_TOKEN_EXPIRATION_TIME = '2d';

const getAccessExpiry = () => dayjs().add(5, 's').toDate();
const getRefreshExpiry = () => dayjs().add(1, 'd').toDate();

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handeleSigin(user: User) {
    const { refreshToken } = await this.getJwtRefreshToken(
      user.id,
      user?.email,
      user.role,
    );
    const { accessToken } = await this.getJwtAccessToken(
      user.id,
      user.role,
      user.email,
    );

    try {
      const hash = await argon.hash(refreshToken);
      const token = await this.prismaService.token.create({
        data: {
          expiresAt: getRefreshExpiry(),
          refreshToken: hash,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return {
        accessToken,
        refreshToken,
        tokenId: token.id,
        accessTokenExpires: getAccessExpiry(),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signUp(dto: AuthBody) {
    const password = await argon.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password,
        },
      });
      return await this.handeleSigin(user);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw err;
    }
  }

  async signIn(dto: AuthBody) {
    //find a user
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if the there is no user throw exception
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.password == null) {
      //this email didn't sign in using form
      //here i send a mail explaining the situation
      throw new ForbiddenException(
        'Credentilas incorrect or this email was gotten from a social account',
      );
    }
    // compare password
    const isMatch = await argon.verify(user.password, dto.password);

    if (!isMatch) {
      throw new ForbiddenException('Password incorrect');
    }

    return await this.handeleSigin(user);
  }

  async signOut(tokenId: string) {
    try {
      await this.prismaService.token.delete({
        where: {
          id: tokenId,
        },
      });
      return {
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    tokenId: string,
    payload: ITokenPayload,
  ) {
    const foundToken = await this.prismaService.token.findUnique({
      where: {
        id: tokenId,
      },
    });

    const isMatch = await argon.verify(
      foundToken.refreshToken ?? '',
      refreshToken,
    );

    const issuedAt = dayjs.unix(payload.iat);
    const diff = dayjs().diff(issuedAt, 'seconds');

    if (foundToken == null) {
      //refresh token is valid but the id is not in database
      //TODO:inform the user with the payload sub
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (isMatch) {
      return await this.generateTokens(payload, tokenId);
    } else {
      //less than 1 minute leeway allows refresh for network concurrency
      if (diff < 60 * 1 * 1) {
        console.log('leeway');
        return await this.generateTokens(payload, tokenId);
      }

      //refresh token is valid but not in db
      //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
      if (payload.sub !== foundToken.userId) {
        //the sub of the token isn't the id of the token in db
        // log out all session of this payalod id, reFreshToken has been compromised
        await this.prismaService.token.deleteMany({
          where: {
            userId: payload.sub,
          },
        });
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  public async getJwtRefreshToken(sub: string, email: string, role: string) {
    const payload: ITokenPayload = { sub, email, role };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    return {
      refreshToken,
    };
  }

  async getJwtAccessToken(
    sub: string,
    role: string,
    email: string,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: ITokenPayload = {
      sub,
      email,
      role,
      isSecondFactorAuthenticated,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    return {
      accessToken,
    };
  }

  private async generateTokens(payload: ITokenPayload, tokenId: string) {
    const { accessToken } = await this.getJwtAccessToken(
      payload.sub,
      payload.role,
      payload.email,
    );

    const { refreshToken: newRefreshToken } = await this.getJwtRefreshToken(
      payload.sub,
      payload.role,
      payload.email,
    );

    const hash = await argon.hash(newRefreshToken);

    await this.prismaService.token.update({
      where: {
        id: tokenId,
      },
      data: {
        refreshToken: hash,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenId: tokenId,
      accessTokenExpires: getAccessExpiry(),
      user: {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      },
    };
  }
}
