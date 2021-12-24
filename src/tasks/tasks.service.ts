/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { text } from 'stream/consumers';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
        private configService: ConfigService
    ) {}


    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.tasksRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const sgMail = require('@sendgrid/mail');
        const API_KEY = this.configService.get('sendgrid');
        const task = await this.getTaskById(id);

        task.status = status;
        await this.tasksRepository.save(task);

        sgMail.setApiKey(API_KEY);
        const message = {
            to: 'opro1801@gmail.com',
            from: 'thanhlampham215@gmail.com',
            subject: 'Task Management',
            text: `You completed the task ${task.taskName} with sequence number ${task.sequenceNumber}`,
            html: `<h1>You completed the task ${task.taskName} with sequence number ${task.sequenceNumber}</h1>`,
        };
        sgMail.send(message)
            .then(response => console.log('Email sent.'))
            .catch(error => console.log(error.message));
        return task;
    }

    async editTask(id: string, taskName: string, sequenceNumber: string): Promise<Task> {
            const task = await this.getTaskById(id);
            task.taskName = taskName;
            task.sequenceNumber = sequenceNumber;
            await this.tasksRepository.save(task);
            return task;
    }

    deleteTask(id: string): Promise<void> {
        return this.tasksRepository.deleteTask(id);
    }

    resetTask(): Promise<void> {
        return this.tasksRepository.resetTask();
    }

    // resetTask(): void {
    //     this.tasks = [];
    // }
}
