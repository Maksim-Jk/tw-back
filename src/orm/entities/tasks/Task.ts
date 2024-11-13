import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from '../projects/Project';
import { User } from '../users/User';

import { TaskFile } from './TaskFile';
import { TaskFlagTypes } from './TaskFlagsTypes';
import { TaskPriorityTypes } from './TaskPriorityTypes';
import { TaskStatusTypes } from './TaskStatusTypes';
import { TaskTypeTypes } from './TaskTypesTypes';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  page_url: string;

  @ManyToOne(() => TaskTypeTypes)
  @JoinColumn({ name: 'type_id' })
  type: TaskTypeTypes;

  @ManyToOne(() => TaskStatusTypes)
  @JoinColumn({ name: 'status_id' })
  status: TaskStatusTypes;

  @ManyToOne(() => TaskPriorityTypes)
  @JoinColumn({ name: 'priority_id' })
  priority: TaskPriorityTypes;

  @ManyToMany(() => TaskFlagTypes)
  @JoinTable({
    name: 'task_flags',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'flag_id', referencedColumnName: 'id' },
  })
  flags: TaskFlagTypes[];

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => TaskFile, (file: TaskFile) => file.task)
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
