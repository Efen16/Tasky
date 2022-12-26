import { HttpException, HttpStatus, Injectable, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeLevelColumn } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { RoleEntity } from './models/role.entity';
import { UserEntity } from './models/user.entity';
import { Http2ServerRequest } from 'http2';
import { LoginUserDto } from './dto/loginUser.dto';
import {compare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
        private readonly jwtService: JwtService
      ) {}


    async createUser(createUserDto: CreateUserDto): Promise<string>{
        const newUser = new UserEntity();
        const roleId:number = 1;
        Object.assign(newUser,createUserDto);

        const userByEmail = await this.userRepository.findOne({
            where:{
                email: createUserDto.email
            }
        })

        if(userByEmail){
            throw new HttpException("Email already exists", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        //TO DO SEED AND MIGRATIONS
        // Potential error if role relation is not already seeded
        const role = await this.roleRepository.findOne({
            where:{
                id:roleId
            }
        });
        newUser.role = role;
        
        const user = await this.userRepository.save(newUser);
        return this.buildUserResponse(user);
    }



    

    // Idea is that front will store this token in local storage/cookie 
    // and attach it to every request
    buildUserResponse(user: UserEntity): string {
        return this.jwtService.sign({
            sub: user.id,
            role: user.role.name
        })
    }

    async login(loginUserDto: LoginUserDto):Promise<string>{
        const user = await this.userRepository.findOne({
            where: {email: loginUserDto.email},
             relations: ["role"],
             select:["id","firstName","lastName","password",
                     "gender","phone","email"]
         });

         console.log(user);
        if(!user){
            throw new HttpException('Wrong email', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const passwordCheck = await compare(loginUserDto.password, user.password);
        if(!passwordCheck){
            throw new HttpException("Wrong password", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        
        delete user.password;
        return this.buildUserResponse(user);
    }

    async getUserById(id){
        const user = this.userRepository.findOne({
            where:{
                id:id
            }
        })
    
        if(!user){
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        return user;
    
    
    }


}
