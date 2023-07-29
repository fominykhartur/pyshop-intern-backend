import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  name: string;
  telNumber: string;
  address: string;
  info: string;
}
