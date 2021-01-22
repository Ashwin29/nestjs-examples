import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks = (): Task[] => {
    return this.tasks;
  };

  getTasksWithFilter = (filterDto: GetTasksFilterDto): Task[] => {
    const { search, status } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  };

  getTaskById = (id: string): Task => {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return found;
  };

  createTask = (createTaskDto: CreateTaskDto): Task => {
    const { title, description } = createTaskDto;

    const task: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
      id: uuidv4(),
    };

    this.tasks.push(task);
    return task;
  };

  deleteTaskById = (id: string): void => {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  };

  updateTaskStatus = (id: string, status: TaskStatus): Task => {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  };
}
