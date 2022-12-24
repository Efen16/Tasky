import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { RoleEntity } from './models/role.entity';
import { UserEntity } from './models/user.entity';
import {sign} from 'jsonwebtoken'

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


    generateJwt(user:UserEntity){
        return sign({
            id: user.id,
            email: user.email,
        },"SECRET");
        //TO DO CREATE ENV FILE AND SWITCH TO APSOLUTE PATH
    }

    buildUserResponse(user: UserEntity): any {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }


}
