import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto{
    
    @IsNotEmpty() 
    @IsString()
    readonly password:string;
   
    @IsNotEmpty()
    @IsString()
    readonly email: string;

 
}