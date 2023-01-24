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
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ProjectsEntity } from '../projects/models/projects.entity';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
        @InjectRepository(ProjectsEntity)
        private readonly projectRepository: Repository<ProjectsEntity>,
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

        const role = await this.roleRepository.findOne({
            where:{
                id:roleId
            }
        });
        
        if(!role){
            throw new HttpException("There are no roles in db, currently need to be added mannualy",HttpStatus.NOT_IMPLEMENTED);
        }
        newUser.role = role;
        
        const user = await this.userRepository.save(newUser);
        return this.buildUserResponse(user);
    }

    buildUserResponse(user: UserEntity): string {
        return this.jwtService.sign({
            sub: user.id,
        })
    }

    async login(loginUserDto: LoginUserDto):Promise<string>{
        const user = await this.userRepository.findOne({
            where: {email: loginUserDto.email},
             relations: ["role"],
             select:["id","firstName","lastName","password",
                     "gender","phone","email"]
         });

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


    async paginate(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
        const usersWithRoles = await this.userRepository.createQueryBuilder("u")
                                                  .innerJoinAndSelect("u.role","role");
        return paginate(usersWithRoles,options)
    }


    async updateUser(id:number, updateUserDto:UpdateUserDto){
        if(updateUserDto.email){
            if(await this.isEmailTakenByAnother(id,updateUserDto.email)){
                throw new HttpException("Email already exists", HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }

        const user = await this.userRepository.findOne({
            where:{id:id}
        });

        Object.assign(user,updateUserDto);
        if(updateUserDto.role){
            const role = await this.roleRepository.findOne({
                where:{
                    name:updateUserDto.role
                }
            });

            user.role = role;
        }
            
        if(updateUserDto.project_ids){
            if(updateUserDto.project_ids.length){
                for(const project_id of updateUserDto.project_ids){
                    const project = await this.getProject(project_id);
                    if(!project){
                        throw new HttpException("Project doesn't exist", HttpStatus.NOT_FOUND);
                    }

                    project.users.push(user);
                    this.projectRepository.save(project);
                }
            }    
        }

        return this.userRepository.save(user);
    }

    async deleteUser(id:number){
        this.userRepository.delete(id);
    }

    async getUserById(id){
        const user = await this.userRepository.findOne({
            where:{
                id:id
            }
        })
        
        if(!user){
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        return user;
    }


    async isEmailTakenByAnother(id:number, email:string){
        return await this.userRepository
                    .createQueryBuilder("user")
                    .where("user.email = :email AND user.id=:id",{email:email,id:id})
                    .getExists()
    }
    

    async getProject(id:number):Promise<ProjectsEntity>{
        return await  this.projectRepository.findOne({
            where:{
                id:id
                },
            relations:{
                users:true
            }
            });
        }

        
    async getUsersRole(id:number){
        const role = await this.roleRepository.findOne({
            relations:{
                users:true
            },where:{
                users:{
                    id:id
                }
            }
        });
        return role.name;
    }

}
