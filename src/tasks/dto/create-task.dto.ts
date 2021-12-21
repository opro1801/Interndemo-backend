import { IsAlphanumeric, IsDecimal, IsInt, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    taskName: string;

    @IsNotEmpty()
    @IsDecimal()
    sequenceNumber: string;
}

