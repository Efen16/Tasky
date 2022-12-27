import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { GenderEnum } from "../types/gender.enum";
import { RoleNameEnum } from "../types/role.enum";

export class UpdateUserDto{
    @IsOptional()
    @IsString()
    readonly email?:string;
    @IsOptional()
    @IsString()
    readonly firstName?:string;

    @IsOptional()
    @IsString()
    readonly lastName?:string

    @IsOptional()
    @IsString()
    readonly phone?:string

    @IsOptional()
    readonly gender?:GenderEnum

    @IsOptional()
    readonly role?:RoleNameEnum

    @IsOptional()
    @IsArray()
    readonly project_ids?:number[]
}