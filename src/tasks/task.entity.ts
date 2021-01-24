import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  user: User;

  @Column()
  userId: number;
}
