import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/users')
  async users() {
    const res = await this.authService.allUsers();
    console.log(res);
    return res;
  }

  @Get('/delete')
  async del() {
    const res = await this.authService.delete();
    console.log(res);
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
  async signin(@Body() dto: AuthDTO) {
    const jwt = await this.authService.signIn(dto);
    return jwt;
  }
}
