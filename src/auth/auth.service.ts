import { Injectable } from '@nestjs/common';
import { User } from '../types/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService, private jwtService: JwtService) {
  }
  async generateTokenViaGoogleLogin(user: User): Promise<string> {
    const payload = {email: user.email, sub: user.id}

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h'
    });
  }

  async validateUser(payload: any) {
    return payload;
  }
}
