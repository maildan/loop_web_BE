import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.authService.findOrCreateUser(req.user);
    const { access_token } = await this.authService.login(user);

    // In a real app, you might redirect to a frontend URL with the token
    // For now, we'll just return the token
    res.redirect(`${process.env.FRONTEND_URL}?token=${access_token}`);
  }
}

