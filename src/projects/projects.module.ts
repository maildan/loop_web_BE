import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { Character } from './entities/character.entity';
import { Memo } from './entities/memo.entity';
import { Synopsis } from './entities/synopsis.entity';
import { Chapter } from './entities/chapter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Character,
      Memo,
      Synopsis,
      Chapter,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule { }
