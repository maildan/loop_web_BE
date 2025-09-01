import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':id')
  async getProjectDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOneWithDetails(id);
  }
}
