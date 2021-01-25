import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.model';

/**
 * Task service handles all the business related logic.
 */
@Injectable()
export class TasksService {
  // Initialize the logger.
  private logger = new Logger('TaskService');

  constructor(
    /**
     * Perform dependency injection for including
     * the task repository for performing database operations.
     */
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  /**
   * Takes care of retrieving all the respective tasks or, retrieving
   * tasks based on it's search query or status type.
   * @param filterDto This dto has the search and the status query.
   */
  getTasks = async (
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> => {
    // Return all the retrieved tasks.
    return this.taskRepository.getAllTasks(filterDto, user);
  };

  /**
   * Retrieves the task object based on it's id.
   * @param id ID of the task to be retrieved.
   */
  getTaskById = async (id: number, user: User): Promise<Task> => {
    // Find task for it's given id.
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      // Log the exception that occurred while finding the task based id.
      this.logger.error(`Failed to retrieve the task for id ${id}.`);

      // If not found return task doesn't exist exception.
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    // Return task.
    return found;
  };

  /**
   * Creates a new task for the give title and description.
   * @param createTaskDto Contains title and description.
   */
  createTask = async (
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> => {
    // Return created task object.
    return this.taskRepository.createTask(createTaskDto, user);
  };

  /**
   * Deletes a task based on it's id.
   * @param id ID of the task to be deleted.
   */
  deleteTask = async (id: number, user: User): Promise<void> => {
    // Delete the task for the given id.
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      // Log the exception that occurred while deleting the task based id.
      this.logger.error(`Failed to delete the task for id ${id}`);

      // If rows are not affected then throw exception.
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
  };

  /**
   * Updates the status of the task based on it's id.
   *
   * @param id ID of the task to be updated.
   * @param status Status value of the tasks to be updated.
   */
  updateTaskStatus = async (
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> => {
    // Retrieve the task based on it's id.
    const task = await this.getTaskById(id, user);

    // Change the status of the task.
    task.status = status;

    try {
      // Save the task.
      await task.save();

      // Return Task.
      return task;
    } catch (error) {
      // Log the exception that occurred while updating the status of the task based id.
      this.logger.error(
        `Failed to update status ${status} for the task id ${id}. ${error.stack}`,
      );

      // Throw internal server error 501.
      throw new InternalServerErrorException();
    }
  };
}
