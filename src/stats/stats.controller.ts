import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(AuthGuard('jwt'))
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(@Req() req: Request & { user: User }) {
    // The user object is attached to the request by the AuthGuard
    const user = req.user;
    return this.statsService.getDashboardStats(user.id);
  }
}
