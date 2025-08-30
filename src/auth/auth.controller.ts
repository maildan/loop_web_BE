import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import type { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request & { user: User }, @Res() res: Response) {
    // The user object is already attached to the request by the GoogleStrategy's validate function.
    // We can use it directly to log the user in.
    const { access_token, user } = await this.authService.login(req.user);

    // Redirect to the frontend with the access token and user info.
    const userParam = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${access_token}&user=${userParam}`);
  }
}

