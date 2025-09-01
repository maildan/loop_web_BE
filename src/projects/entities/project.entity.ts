import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
// import { User } from '../../users/entities/user.entity';
import { Character } from './character.entity';
import { Memo } from './memo.entity';
import { Synopsis } from './synopsis.entity';
import { Chapter } from './chapter.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // @ManyToOne(() => User, user => user.projects)
  // user: User;

  @OneToMany(() => Character, character => character.project, { cascade: true })
  characters: Character[];

  @OneToMany(() => Memo, memo => memo.project, { cascade: true })
  memos: Memo[];

  @OneToMany(() => Synopsis, synopsis => synopsis.project, { cascade: true })
  synopses: Synopsis[];

  @OneToMany(() => Chapter, chapter => chapter.project, { cascade: true })
  chapters: Chapter[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
