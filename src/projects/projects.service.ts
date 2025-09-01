import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findOneWithDetails(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: [
        'characters',
        'memos',
        'synopses',
        'chapters',
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    // Sort chapters by order
    if (project.chapters) {
      project.chapters.sort((a, b) => a.order - b.order);
    }

    return project;
  }

  // We will add more methods here for creating, updating, and deleting projects and their items.
}
