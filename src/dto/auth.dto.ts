import { IsEmail, IsEmpty, IsStrongPassword } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
  login: string;
}
