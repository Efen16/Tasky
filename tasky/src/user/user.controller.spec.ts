import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserEntity } from './models/user.entity';
import { GenderEnum } from './types/gender.enum';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{
                provide: UserService,
                useValue: {
                    createUser: jest.fn(() => Promise.resolve('User created')),
                    login: jest.fn(() => Promise.resolve('Token')),
                    getUserById: jest.fn(() => Promise.resolve({ id: 1, email: 'test@example.com' })),
                    paginate: jest.fn(() => Promise.resolve({ data: [], meta: {} } as unknown as Pagination<UserEntity>)),
                    updateUser: jest.fn(() => Promise.resolve('User updated')),
                    deleteUser: jest.fn(() => Promise.resolve('User deleted')),
                },
            }],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = {
            email: 'test@@gmail.com',
            password: 'password',
            firstName: 'test',
            lastName: 'test',
            gender: GenderEnum.MALE
        };
            expect(await controller.createUser(createUserDto)).toEqual('User created');
        });
    });

    describe('login', () => {
        it('should login a user', async () => {
            const loginUserDto: LoginUserDto = {
            email: 'test@example.com',
            password: 'password',
        };
        expect(await controller.login(loginUserDto)).toEqual('Token');
        });
    });

    describe('getUserById', () => {
        it('should get a user by id', async () => {
            expect(await controller.getUserById(1)).toEqual({ id: 1, email: 'test@example.com' });
        });
    });

    describe('getUsers', () => {
        it('should get a list of users', async () => {
            const pagination = { data: [], meta: {} } as unknown as Pagination<UserEntity>;
            expect(await controller.getUsers(1, 10)).toEqual(pagination);
        });
    });


    describe('updateUser', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = {
                email: 'updated@example.com'
            };

            expect(await controller.updateUser(1, updateUserDto)).toEqual('User updated');
        });
    
    });
    
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            expect(await controller.deleteUser(1)).toEqual('User deleted');
        });
    });
});



