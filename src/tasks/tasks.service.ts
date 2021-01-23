import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  getTasks = async (filterDto: GetTasksFilterDto): Promise<Task[]> => {
    // Return all the retrieved tasks.
    return this.taskRepository.getAllTasks(filterDto);
  };

  /**
   * Retrieves the task object based on it's id.
   * @param id ID of the task to be retrieved.
   */
  getTaskById = async (id: number): Promise<Task> => {
    // Find task for it's given id.
    const found = await this.taskRepository.findOne(id);

    if (!found) {
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
  createTask = async (createTaskDto: CreateTaskDto): Promise<Task> => {
    // Return created task object.
    return this.taskRepository.createTask(createTaskDto);
  };

  /**
   * Deletes a task based on it's id.
   * @param id ID of the task to be deleted.
   */
  deleteTask = async (id: number): Promise<void> => {
    // Delete the task for the given id.
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
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
  updateTaskStatus = async (id: number, status: TaskStatus): Promise<Task> => {
    // Retrieve the task based on it's id.
    const task = await this.getTaskById(id);

    // Change the status of the task.
    task.status = status;

    // Save the task.
    await task.save();

    // Return Task.
    return task;
  };
}
