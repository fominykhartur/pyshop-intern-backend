import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: `${process.env.ACCESS_TOKEN_LIFETIME}s`,
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
