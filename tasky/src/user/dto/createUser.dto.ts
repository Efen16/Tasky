import { GenderEnum } from "../models/gender.enum";
import { RoleEntity } from "../models/role.entity";

export class CreateUserDto{

    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password:string;
    readonly phone?: string;
    readonly role?: RoleEntity
    readonly gender: GenderEnum

}