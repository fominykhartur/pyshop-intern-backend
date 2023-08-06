import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/dto/user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post('/updateInfo')
  async updateInfo(@Req() req: Request, @Body() dto: UserDTO) {
    // console.log(req.cookies);
    return await this.userService.updateInfo(dto);
  }

  @Get(':id')
  async getUserInfo(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserInfo(id);
  }
}
