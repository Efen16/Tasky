import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { SortByPriority } from "../types/sort.enum";

export class FilterDto{
    @IsArray()
    @IsOptional()
    private readonly assignees?: number[];

    @IsOptional()
    @IsBoolean()
    private readonly completed?: boolean;

    @IsOptional()
    @IsString()
    private readonly name?: string

    @IsOptional()
    private readonly sort?: SortByPriority
}