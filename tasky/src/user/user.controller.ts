import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserEntity } from './models/user.entity';
import { RoleNameEnum } from './types/role.enum';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(private readonly userService: UserService){}

    @Post("signup")
    @UsePipes(new ValidationPipe())
    async createUser(@Body() createUserDto:CreateUserDto): Promise<string>{
        return await this.userService.createUser(createUserDto);
    }

    @Post("login")
    @UsePipes(new ValidationPipe())
    async login(@Body() loginUserDto: LoginUserDto):Promise<string>{
        return await this.userService.login(loginUserDto);
        
    }

    // @Roles(RoleNameEnum.ADMIN, RoleNameEnum.MANAGER)

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Get()
    // async getUser(@Request() req){
    //     console.log(req.user);
    // }

   




}




