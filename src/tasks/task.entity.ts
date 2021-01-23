import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './tasks.model';

/**
 * Task entity.
 */
@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  /* Primary column: id for the given task. */
  id: number;

  @Column()
  /* title for the given task. */
  title: string;

  @Column()
  /* description for the given task. */
  description: string;

  @Column()
  /* status for the given task. */
  status: TaskStatus;
}
