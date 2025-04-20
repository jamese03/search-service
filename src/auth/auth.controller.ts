import { BadRequestException, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './google-auth.guard';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../types/types';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLogin() {} // nest handles automatically

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Public()
  async googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user;

    if(!user) {
      throw new BadRequestException("request must contain user");
    }
    if(user) {
      const token = await this.authService.generateTokenViaGoogleLogin(user as User);
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') == 'production',
        sameSite: 'lax'
      })
      res.redirect(this.configService.get('FRONTEND_URL') || 'http://localhost:5173');
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.sendStatus(200);
  }
}