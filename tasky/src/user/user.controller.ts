import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe, Request, Param, ParseIntPipe, Query, DefaultValuePipe, Patch, Delete } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
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


    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get('users/:id')
    async getUserById(@Param('id', ParseIntPipe) id:number){
        return await this.userService.getUserById(id);
    }

    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get('')
    async getUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,): Promise<Pagination<UserEntity>> {
            limit = limit > 100 ? 100 : limit;
            return this.userService.paginate({
                page,
                limit,
            });
    }

    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Patch('/:id')
    async updateUser(@Param('id',ParseIntPipe) id:number, @Body() updateUserDto:UpdateUserDto){
        return await this.userService.updateUser(id,updateUserDto);
    }

    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Delete('/:id')
    async deleteUser(@Param('id',ParseIntPipe) id:number){
        return await this.userService.deleteUser(id);
    }

}




