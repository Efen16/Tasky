import { ParseBoolPipe } from "@nestjs/common";
import { IsArray, IsBoolean, isNumber, IsNumber, IsOptional, IsString } from "class-validator";
import { SortByPriority } from "../types/sort.enum";

export class FilterDto{
    
    @IsOptional()
    assignees?;

    @IsOptional()
    completed?: string;

    @IsOptional()
     title?: string

    @IsOptional()
    sort?: SortByPriority
}