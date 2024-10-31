import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_priorities')
export class TaskPriority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;
}

export enum TaskPriorityEnum {
  HIGHEST = 'highest',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LOWEST = 'lowest',
}
