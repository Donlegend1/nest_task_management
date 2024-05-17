import { Controller, Post, Body, Get, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity/user.entity';
import { Request } from 'express';

@Controller('tasks')
// @UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const user = req.user as User;
    console.log('====================================');
    console.log(req.user);
    console.log('====================================');
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  async getAllTasks(@Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.getAllTasks(user);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.getTaskById(id, user);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Req() req: Request): Promise<{ message: string }> {
    const user = req.user as User;
    return this.tasksService.deleteTask(id, user);
  }
}
