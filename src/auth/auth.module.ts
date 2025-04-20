import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleOAuthStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

@Module({
  imports:[
    JwtModule.register(({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1h'}
    }))
  ],
  providers: [AuthService, GoogleOAuthStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
