import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './models/user.entity';
import { userResponse } from './types/userResponse.intefrace';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(private readonly userService: UserService){}

    @Post("Signup")
    @UsePipes(new ValidationPipe())
    async createUser(@Body() createUserDto:CreateUserDto): Promise<userResponse>{
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }



}
