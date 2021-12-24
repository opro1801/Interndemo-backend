/* eslint-disable prettier/prettier */
import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

    async getTaskById(id: string): Promise<Task> {
        const found = await this.findOne(id);

        if(!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');
        if(status) {
            query.andWhere('task.status = :status', { status })
        }
        if(search) {
            query.andWhere(
                'LOWER(task.taskName) LIKE LOWER(:search) OR LOWER(task.sequenceNumber) LIKE LOWER(:search)',
                { search: `%${search}%`},
            );
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { taskName, sequenceNumber } = createTaskDto;

        const task = this.create({
            taskName,
            sequenceNumber,
            status: TaskStatus.IN_PROGRESSS,
        });
        await this.save(task);
        return task;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async resetTask(): Promise<void> {
        const query = this.createQueryBuilder('task');
        query.delete().where("status = :status1 OR status = :status2", { status1: 'COMPLETE', status2: 'IN_PROGRESS'}).execute();
    }
}