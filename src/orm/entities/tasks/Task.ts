import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Project } from '../projects/Project';
import { User } from '../users/User';

import { TaskFile } from './TaskFile';
import { TaskFlag } from './TaskFlag';
import { TaskPriority } from './TaskPriority';
import { TaskStatus } from './TaskStatus';
import { TaskType } from './TaskType';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  page_url: string;

  @ManyToOne(() => TaskType)
  @JoinColumn({ name: 'type_id' })
  type: TaskType;

  @ManyToOne(() => TaskStatus)
  @JoinColumn({ name: 'status_id' })
  status: TaskStatus;

  @ManyToOne(() => TaskPriority)
  @JoinColumn({ name: 'priority_id' })
  priority: TaskPriority;

  @ManyToOne(() => TaskFlag)
  @JoinColumn({ name: 'flag_id' })
  flag: TaskFlag;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => TaskFile, (file) => file.task)
  files: TaskFile[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
