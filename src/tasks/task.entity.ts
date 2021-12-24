import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    taskName: string;

    @Column()
    sequenceNumber: string;

    @Column()
    status: TaskStatus
}