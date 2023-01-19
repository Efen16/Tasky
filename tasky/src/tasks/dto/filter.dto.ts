import { ParseBoolPipe } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, isNumber, IsNumber, IsOptional, IsString } from "class-validator";
import { SortByPriority } from "../types/sort.enum";

export class FilterDto{

    

    @IsOptional()
    @IsBoolean()
    @Transform(({ value })=> {
        if(value === 'True' || value === 'true') return true;
        if(value === 'False' || value === 'false') return false;
        return value.value;
    })
    completed?: boolean; 

    @IsOptional()
    @IsArray()
    @Transform(({value})=> 
        value.toString().split(',').map(Number))
    assignees?: number[];

    @IsOptional()
    @IsString()
    title?:string;

    @IsOptional()
    @IsString()
    sort? : string
    // @IsOptional()
    // assignees?;

    // @IsOptional()
    // completed?: string;

    // @IsOptional()
    //  title?: string

    // @IsOptional()
    // sort?: SortByPriority
}