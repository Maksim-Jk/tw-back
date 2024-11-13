import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_types_types')
export class TaskTypeTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;
}

export enum TaskTypeEnum {
  TASK = 'task',
  QUESTION = 'question',
}
