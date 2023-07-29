import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { AuthDTO } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}
  async singUp(dto: AuthDTO) {
    dto.password = await bcrypt.hash(dto.password, 10);
    return this.databaseService.user
      .create({
        data: dto,
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async signIn(dto: AuthDTO) {
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });
    if (await bcrypt.compare(dto.password, user.password)) {
      const payload = { id: user.id, username: user.login };
      const jwt = await this.jwtService.signAsync(payload);
      return { access_token: jwt };
    } else {
      throw new UnauthorizedException();
    }
  }

  async allUsers() {
    return this.databaseService.user.findMany();
  }

  async delete() {
    return this.databaseService.user.delete({ where: { id: 3 } });
  }
}
