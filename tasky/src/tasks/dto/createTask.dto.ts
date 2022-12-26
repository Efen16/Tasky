import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { PriorityEnum } from "../types/priority.enum";

export class CreateTaskDto{

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsNumber()
    readonly assignee_id?:number;

    @IsOptional()
    readonly priority?: PriorityEnum

    @IsOptional()
    readonly project_id?: number;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsBoolean()
    readonly isCompleted: boolean
}