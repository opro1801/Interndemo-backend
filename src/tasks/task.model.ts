export interface Task {
    id: string;
    taskName: string;
    sequenceNumber: string;
    status: TaskStatus;
}

export enum TaskStatus {
    IN_PROGRESSS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE',
}