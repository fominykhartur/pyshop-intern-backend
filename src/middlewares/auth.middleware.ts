import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (
      !(
        req.headers.authorization &&
        req.headers.authorization?.split(' ')[0] === 'Bearer'
      )
    ) {
      throw new UnauthorizedException();
    }

    const Token = req.headers.authorization?.split(' ')[1] || '';
    let isAuth = true;
    await this.jwtService.verifyAsync(Token).catch((e) => {
      console.error(e);
      isAuth = false;
    });

    if (!isAuth) {
      throw new UnauthorizedException();
    }
    next();
  }
}
