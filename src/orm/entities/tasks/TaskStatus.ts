import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_statuses')
export class TaskStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;
}

export enum TaskStatusEnum {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  CREATED = 'created',
  ARCHIVED = 'archived',
}
