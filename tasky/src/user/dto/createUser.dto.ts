import { IsEmail, IsMobilePhone, IsNotEmpty } from "class-validator";
import { GenderEnum } from "../models/gender.enum";
import { RoleEntity } from "../models/role.entity";

export class CreateUserDto{

    //TO DO CHECK SOME MORE VALIDATORS
    @IsNotEmpty()
    readonly firstName: string;
    @IsNotEmpty()
    readonly lastName: string;
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty() //TO DO ADD REGEX FOR PASSWORD
    readonly password:string;
    readonly phone?: string;
    readonly role?: RoleEntity
    @IsNotEmpty()
    readonly gender: GenderEnum

}