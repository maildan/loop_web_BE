import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAllForUser(@Req() req) {
    // The user object is attached to the request by the JwtStrategy
    return this.eventsService.findForUser(req.user.userId);
  }
}

