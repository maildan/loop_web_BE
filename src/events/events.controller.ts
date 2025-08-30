import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAllForUser(@Req() req: Request & { user: { userId: string } }) {
    // The user object is attached to the request by the JwtStrategy
    return this.eventsService.findForUser(req.user.userId);
  }
}

