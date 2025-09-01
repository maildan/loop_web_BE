import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

export enum SynopsisType {
  OUTLINE = 'outline',
  TIMELINE = 'timeline',
  MINDMAP = 'mindmap',
}

@Entity('synopses')
export class Synopsis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: SynopsisType,
    default: SynopsisType.OUTLINE,
  })
  type: SynopsisType;

  @Column({ type: 'jsonb', nullable: true })
  content: any;

  @ManyToOne(() => Project, project => project.synopses, { onDelete: 'CASCADE' })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
