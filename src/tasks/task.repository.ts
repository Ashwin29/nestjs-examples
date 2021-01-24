import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks.model';

/**
 * Task Repository handles all the database related transactions.
 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  /**
   * Performs database related operations for retrieving tasks.
   * @param filterDto This dto has the search and the status query.
   */
  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    // Destructure filter dto.
    const { search, status } = filterDto;

    // Create a query builder for the table task.
    const query = this.createQueryBuilder('task');

    // Get all the tasks for the specified user id.
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      // Search for a record where status is matched.
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      // Search for a record where search query matches partial
      // values of the respective entity's title or description.
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    // Get all the tasks.
    const tasks = await query.getMany();

    // Return tasks.
    return tasks;
  }

  /**
   * Performs database related operations for the
   * @param createTaskDto Contains title and description.
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // Destructure the create task dto.
    const { description, title } = createTaskDto;

    // Create a new task.
    const task = new Task();

    // Assign task values.
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    // Save the task.
    await task.save();

    // Delete user object before sending it as response.
    delete task.user;

    // Return task.
    return task;
  }
}
