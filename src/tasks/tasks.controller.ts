/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Delete, Patch, Query } from '@nestjs/common';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);

    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(
       @Body() createTaskDto: CreateTaskDto
    ) : Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    ) : Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Patch(':id/edit')
    editTask(
        @Param('id') id: string,
        @Body() editTaskDto: EditTaskDto,
    ) : Promise<Task> {
        const {taskName, sequenceNumber} = editTaskDto;
        return this.tasksService.editTask(id, taskName, sequenceNumber);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string) : Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    @Delete()
    resetTask() : Promise<void> {
        return this.tasksService.resetTask();
    }
}
