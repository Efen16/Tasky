import {  IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UserEntity } from "src/user/models/user.entity";

export class CreateProjectDto{
    @IsNotEmpty()
    @IsString()
    readonly name: string 

    @IsOptional()
    @IsNumber()
    readonly managerId?:number
}