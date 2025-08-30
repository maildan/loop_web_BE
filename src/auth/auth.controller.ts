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
    // The user object is already attached to the request by the GoogleStrategy's validate function.
    // We can use it directly to log the user in.
    const { access_token } = await this.authService.login(req.user);

    // Redirect to the frontend with the access token.
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`);
  }
}

