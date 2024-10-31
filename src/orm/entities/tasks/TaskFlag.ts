import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_flags')
export class TaskFlag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;
}

export enum TaskFlagEnum {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  NORMAL = 'normal',
  LOW_PRIORITY = 'low_priority',
}
