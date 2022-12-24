import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeLevelColumn } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { RoleEntity } from './models/role.entity';
import { UserEntity } from './models/user.entity';
import {sign} from 'jsonwebtoken'
import { userResponse } from './types/userResponse.intefrace';
import { Http2ServerRequest } from 'http2';
import { LoginUserDto } from './dto/loginUser.dto';
import {compare} from 'bcrypt'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
      ) {}

    
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity>{
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
        
        return await this.userRepository.save(newUser);
    }


    generateJwt(user:UserEntity): string{
        return sign({
            id: user.id,
            email: user.email,
        },"SECRET");
        //TO DO CREATE ENV FILE AND SWITCH TO APSOLUTE PATH
    }

    buildUserResponse(user: UserEntity): userResponse {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }

    async login(loginUserDto: LoginUserDto):Promise<UserEntity>{
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
        return user;
    }


}
