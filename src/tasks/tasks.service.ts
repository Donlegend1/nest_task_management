import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/user.entity/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<{ task: Task; message: string }> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: 'pending', // Default status
      user, // Assign the whole user object
    });

    await this.tasksRepository.save(task);
    return { task, message: 'Task created successfully' };
  }

  async getAllTasks(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user } });
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<{ task: Task; message: string }> {
    const task = await this.getTaskById(id, user);

    if (!Object.keys(updateTaskDto).length) {
      throw new BadRequestException('No update data provided');
    }

    Object.assign(task, updateTaskDto);
    await this.tasksRepository.save(task);
    return { task, message: 'Task updated successfully' };
  }

  async deleteTask(id: number, user: User): Promise<{ message: string }> {
    const task = await this.getTaskById(id, user);
    await this.tasksRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}
