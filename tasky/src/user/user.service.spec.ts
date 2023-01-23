import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import exp from "constants";
import { ProjectsEntity } from "../projects/models/projects.entity";
import { Any, Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { RoleEntity } from "./models/role.entity";
import { UserEntity } from "./models/user.entity";
import { GenderEnum } from "./types/gender.enum";
import { RoleNameEnum } from "./types/role.enum";
import { UserService } from "./user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus, UnprocessableEntityException } from "@nestjs/common";
import {hash} from 'bcrypt'
import { SlowBuffer } from "buffer";

const oneUser: CreateUserDto = {
    firstName: 'Test',
    lastName: 'Testovic',
    email: "test@gmail.com",
    password: 'qwerty',
    gender: GenderEnum.MALE
}

const roleEntity = new RoleEntity();
roleEntity.name = RoleNameEnum.EMPLOYEE;
roleEntity.id = 1;

const userEntity = new UserEntity();
userEntity.email="test@gmail.com";
userEntity.firstName="test";
userEntity.lastName = "testovic";
userEntity.gender = GenderEnum.MALE;
userEntity.id = 1;
userEntity.tasks = [];
userEntity.role = roleEntity




describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>
    let roleRepository: Repository<RoleEntity>
    let projectRepository: Repository<ProjectsEntity>



    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports:[
              JwtModule.register({
                secret: "test"
              })  
            ],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                    }
                },
                {
                    provide: getRepositoryToken(RoleEntity),
                    useValue:{
                        findOne: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(ProjectsEntity),
                    useValue:{

                    }
                },
            ]
        }).compile();
    
        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
        roleRepository = module.get<Repository<RoleEntity>>(getRepositoryToken(RoleEntity));        
        projectRepository = module.get<Repository<ProjectsEntity>>(getRepositoryToken(ProjectsEntity));
        
    });

    it('should be defined', ()=> {
        expect(userService).toBeDefined()
    });


    //createUser(Register)
    describe('should try to register a user',()=> {
        it('should throw an error because email already exists', async ()=>{
            const userRepositoryFindOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntity);
            expect(userService.createUser(oneUser)).rejects.toThrow(new HttpException("Email already exists", HttpStatus.UNPROCESSABLE_ENTITY));
            expect(userRepositoryFindOneSpy).toBeCalledWith({where: {"email": userEntity.email}});
            
        });
        it('should create new user and return token', async ()=>{
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(roleRepository, 'findOne').mockResolvedValue(roleEntity);
            jest.spyOn(userRepository,'save').mockResolvedValue(userEntity);
            expect(userService.createUser(oneUser)).resolves.toEqual(expect.any(String));           
            
        })
    })
    //login
    describe('should try to login a user', ()=>{
        it('should throw an error beacuse user does not exist', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            expect(userService.login({email: "test@gmail.com", password: "something"})).rejects.toThrow(new HttpException('Wrong email', HttpStatus.UNPROCESSABLE_ENTITY));
        });
        it('should login user', async()=>{
            const fakePassword = 'test';
            const hashPassword = await hash(fakePassword,12);
            userEntity.password = hashPassword;
            jest.spyOn(userRepository,'findOne').mockResolvedValue(userEntity);
            expect(userService.login({email:userEntity.email, password:fakePassword})).resolves.toEqual(expect.any(String));            
            
       })
       it('should throw error because passwords dont match', async ()=>{
            jest.spyOn(userRepository,'findOne').mockResolvedValue(userEntity);
            expect(userService.login({email:userEntity.email,password:'wrongPassword'})).rejects.toThrow(new HttpException("Wrong password", HttpStatus.UNPROCESSABLE_ENTITY));
       })
    })


})
