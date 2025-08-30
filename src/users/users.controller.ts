import { Controller, Get, Req, UseGuards, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserGoalsDto } from './dto/update-user-goals.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    // req.user is populated by the JwtStrategy with the payload of the JWT
    return this.usersService.findByEmail(req.user.email);
  }

  @Patch('me/goals')
  @UseGuards(AuthGuard('jwt'))
  async updateGoals(@Req() req, @Body() updateUserGoalsDto: UpdateUserGoalsDto) {
    return this.usersService.updateGoals(req.user.email, updateUserGoalsDto);
  }
}
