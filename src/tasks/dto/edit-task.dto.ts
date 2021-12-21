import { IsAlphanumeric, IsDecimal, IsNotEmpty, IsNumberString } from "class-validator";

export class EditTaskDto {
    @IsNotEmpty()
    taskName: string;

    @IsNotEmpty()
    @IsDecimal()
    sequenceNumber: string;
}