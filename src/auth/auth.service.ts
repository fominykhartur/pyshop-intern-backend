import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
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

  async generateToken(dto: AuthDTO) {
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });
    if (await bcrypt.compare(dto.password, user.password)) {
      const payload = { id: user.id, username: user.login };
      const jwt = await this.jwtService.signAsync(payload);
      return {
        id: user.id,
        access_token: jwt,
        expiresIn: `${process.env.ACCESS_TOKEN_LIFETIME}s`,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async generateRefreshToken(dto: AuthDTO) {
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });
    if (await bcrypt.compare(dto.password, user.password)) {
      const payload = {
        id: user.id,
        username: user.login,
        type: 'refresh_token',
      };
      const refresh_token = await this.jwtService.signAsync(payload);
      const expires = new Date(
        Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFETIME) * 1000,
      );
      await this.databaseService.user.update({
        where: { id: user.id },
        data: { refreshToken: refresh_token, refreshTokenExpires: expires },
      });
      return { refresh_token: refresh_token, expires: expires };
    } else {
      throw new UnauthorizedException();
    }
  }

  async generateNewAccessToken(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id: id },
    });
    if (user.refreshTokenExpires < new Date(Date.now())) {
      await this.databaseService.user.update({
        where: { id: id },
        data: { refreshToken: null, refreshTokenExpires: null },
      });
      throw new ForbiddenException();
    }
    const payload = { id: user.id, username: user.login };
    const jwt = await this.jwtService.signAsync(payload);
    return {
      access_token: jwt,
      expiresIn: `${process.env.ACCESS_TOKEN_LIFETIME}s`,
    };
  }

  async allUsers() {
    return this.databaseService.user.findMany();
  }
}
