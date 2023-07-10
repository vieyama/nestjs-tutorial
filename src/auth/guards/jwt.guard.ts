import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info) {
    if (info && info.message === 'jwt expired') {
      throw new HttpException('Token Expired', 403);
    }
    if (err || !user) {
      // You can throw an exception based on either "info" or "err" arguments
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
