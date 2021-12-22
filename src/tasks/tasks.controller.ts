import { Body, Controller, Get, Param, Post, Delete, Patch, Query } from '@nestjs/common';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';


@Controller('/')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        if(Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilters(filterDto);
        } else {
            return this.tasksService.getAllTasks();
        }

    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(
       @Body() createTaskDto: CreateTaskDto
    ) : Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    ) : Task {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Patch(':id/edit')
    editTask(
        @Param('id') id: string,
        @Body() editTaskDto: EditTaskDto,
    ) : Task {
        const {taskName, sequenceNumber} = editTaskDto;
        return this.tasksService.editTask(id, taskName, sequenceNumber);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string) : Object {
        return {
            result: this.tasksService.deleteTask(id),
        } 
    }

    @Delete()
    resetTask() : void {
        return this.tasksService.resetTask();
    }
}
