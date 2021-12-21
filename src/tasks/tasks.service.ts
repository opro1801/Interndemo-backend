import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { text } from 'stream/consumers';


@Injectable()
export class TasksService {
    private tasks: Task[] = [];


    getAllTasks() {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto) : Task[] {
        
        const { status, search } = filterDto;
        
        let tasks = this.getAllTasks();

        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }        

        if(search) {
            tasks = tasks.filter(task => {
                if(task.taskName.toLowerCase().includes(search) || task.sequenceNumber.toLocaleLowerCase().includes(search)) return true;
                return false;
            })
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find((task) => task.id === id);
        
        if(!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { taskName, sequenceNumber } = createTaskDto;
        
        const task: Task = {
            id: uuid(),
            taskName,
            sequenceNumber,
            status: TaskStatus.IN_PROGRESSS,
        };

        this.tasks.push(task);
        this.tasks.sort((firstTask: Task, secondTask: Task) => parseInt(firstTask.sequenceNumber) - parseInt(secondTask.sequenceNumber))
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const sgMail = require('@sendgrid/mail');
        const API_KEY: string = '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';

        const task = this.getTaskById(id);

        task.status = status;
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

    editTask(id: string, taskName: string, sequenceNumber: string): Task {
        const task = this.getTaskById(id);
        task.taskName = taskName;
        task.sequenceNumber = sequenceNumber;
        this.tasks.sort((firstTask: Task, secondTask: Task) => parseInt(firstTask.sequenceNumber) - parseInt(secondTask.sequenceNumber))
        return task;
    }

    deleteTask(id: string): boolean {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== id);
        return true;
    }

    resetTask(): void {
        this.tasks = [];
    }
}
