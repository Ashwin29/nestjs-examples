import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation.pipes';
import { Task } from './task.entity';
import { TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

/**
 * Tasks Controller directs operations to it's respective service methods.
 */
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  // Initialize the logger.
  private logger = new Logger('TasksController');

  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    // Log the username for the tasks retrieved.
    this.logger.verbose(`Retrieving all tasks for user ${user.username}.`);

    if (filterDto.search === null && filterDto.status === null) {
      // Log the filter object for the tasks to be returned.
      this.logger.verbose(
        `Retrieving all tasks for filter ${JSON.stringify(filterDto)}.`,
      );
    }

    // Return.
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    // Log the task's id.
    this.logger.verbose(`Retrieving a specific task for the id ${id}`);

    // Return.
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    // Log the user and the values for which the task is created.
    this.logger.verbose(
      `Creating a task ${JSON.stringify(createTaskDto)} for the user ${
        user.username
      }`,
    );

    // Return.
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    // Log the id of the task that's going to be deleted.
    this.logger.verbose(`Deleting the task for id ${id}`);

    // Return.
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    // Log the id for which the status value will be updated.
    this.logger.verbose(
      `Status ${status} will be updated for the task of id ${id}`,
    );

    // Return.
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
