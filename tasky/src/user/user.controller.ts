import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './models/user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(private readonly userService: UserService){}

    @Post("Signup")
    async createUser(@Body() createUserDto:CreateUserDto): Promise<any>{
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }



}
