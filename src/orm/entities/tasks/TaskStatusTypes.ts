import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_statuses_types')
export class TaskStatusTypes {
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
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}
