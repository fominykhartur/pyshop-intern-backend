import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { AuthDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/users')
  async users() {
    const res = await this.authService.allUsers();
    return res;
  }

  @UsePipes(new ValidationPipe())
  @Post('/signup')
  async signup(@Body() dto: AuthDTO) {
    dto.login = dto.email.split('@')[0];
    const user = await this.authService.singUp(dto);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post('/signin')
  async signin(
    @Body() dto: AuthDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.generateToken(dto);
    const refresh_token = await this.authService.generateRefreshToken(dto);

    res.cookie('refreshToken', refresh_token.refresh_token, {
      expires: refresh_token.expires,
      httpOnly: true,
      // path: '/',
      // sameSite: 'none',
      // secure: true,
    });
    return accessToken;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refreshAccessToken')
  async refreshAccessToken(
    @Req() req: Request,
    @Body() user,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.cookies.refreshToken) {
      throw new ForbiddenException();
    }
    const accessToken = await this.authService.generateNewAccessToken(user.id);

    res.cookie('JWT', accessToken.access_token, {
      expires: new Date(
        Date.now() + parseInt(process.env.ACCESS_TOKEN_LIFETIME) * 1000,
      ),
      path: '/',
      sameSite: 'none',
      // secure: true,
    });
    return accessToken;
  }
}
