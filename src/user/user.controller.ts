import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post('/updateInfo')
  async updateInfo(@Body() dto: UserDTO) {
    return await this.userService.updateInfo(dto);
  }

  @Get(':id')
  async getUserInfo(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserInfo(id);
  }
}
