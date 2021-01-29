import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getAllTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockedFilter: GetTasksFilterDto = {
  search: 'black pink',
  status: TaskStatus.DONE,
};

const mockedUser = {
  username: 'Test User',
  id: '123',
};

const mockTask = {
  title: 'Task Title',
  description: 'Task Description',
};

const mockedCreateTaskDto: CreateTaskDto = {
  description: 'Some Description',
  title: 'Some Title',
};

describe('When the task services is called,', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('Should able to get all the tasks.', async () => {
    taskRepository.getAllTasks.mockResolvedValue('Value');
    expect(taskRepository.getAllTasks).not.toHaveBeenCalled();
    const result = await tasksService.getTasks(mockedFilter, mockedUser);
    expect(taskRepository.getAllTasks).toHaveBeenCalled();
    expect(result).toEqual('Value');
  });

  it('Should able to get an error when fetch all tasks is failed.', () => {
    taskRepository.getAllTasks.mockResolvedValue(null);
    expect(taskRepository.getAllTasks).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('Should able to get a task based on its id.', async () => {
    taskRepository.findOne.mockResolvedValue(mockTask);
    const result = await tasksService.getTaskById(1, mockedUser);
    expect(taskRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1, userId: mockedUser.id },
    });
    expect(result).toEqual(mockTask);
  });

  it('Should able to get an error when task is not present for a specified id.', async () => {
    taskRepository.findOne.mockResolvedValue(null);
    expect(tasksService.getTaskById(1, mockedUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should able to create a task.', async () => {
    expect(taskRepository.createTask).not.toHaveBeenCalled();
    taskRepository.createTask.mockResolvedValue(mockTask);
    const result = await tasksService.createTask(
      mockedCreateTaskDto,
      mockedUser,
    );
    expect(taskRepository.createTask).toHaveBeenCalled();
    expect(result).toEqual(mockTask);
  });

  it('Should able to get an error when task creation fails.', async () => {
    expect(taskRepository.createTask).not.toHaveBeenCalled();
    taskRepository.createTask.mockResolvedValue();
    const result = tasksService.createTask(mockedCreateTaskDto, mockedUser);
    expect(result).rejects.toThrow(InternalServerErrorException);
  });

  it('Should able to delete a task.', async () => {
    expect(taskRepository.delete).not.toHaveBeenCalled();
    taskRepository.delete.mockResolvedValue({ affected: 1 });
    await tasksService.deleteTask(1, mockedUser);
    expect(taskRepository.delete).toHaveBeenCalled();
  });

  it('Should able to get an error when task deletion fails.', () => {
    expect(taskRepository.delete).not.toHaveBeenCalled();
    taskRepository.delete.mockResolvedValue({ affected: 1 });
    expect(tasksService.deleteTask(1, mockedUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should able to update the task based on a specific task id.', async () => {
    const save = jest.fn().mockResolvedValue(true);
    tasksService.getTaskById = jest.fn().mockResolvedValue({
      status: TaskStatus.DONE,
      save,
    });

    expect(tasksService.getTaskById).not.toHaveBeenCalled();

    const result = await tasksService.updateTaskStatus(
      1,
      TaskStatus.IN_PROGRESS,
      mockedUser,
    );

    expect(tasksService.getTaskById).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();

    expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
  });
});
