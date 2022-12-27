import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateTaskDto } from 'src/tasks/dto/createTask.dto';
import { TasksEntity } from 'src/tasks/models/tasks.entity';
import { TasksService } from 'src/tasks/tasks.service';

import { UserEntity } from 'src/user/models/user.entity';
import { RoleNameEnum } from 'src/user/types/role.enum';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create.project.dto';
import { ProjectsEntity } from './models/projects.entity';

@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(ProjectsEntity)
        private readonly projectRepository: Repository<ProjectsEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(TasksEntity)
        private readonly taskRepository: Repository<TasksEntity>,
        private readonly taskService: TasksService
     
    ){}


    async createProject(createProjectDto:CreateProjectDto){
        const newProject:ProjectsEntity = new ProjectsEntity();
        const nameTaken = await this.projectRepository 
                              .createQueryBuilder("project")
                              .where("project.name = :name",{name:createProjectDto.name})
                              .getExists();
        
        if(nameTaken){
            throw new HttpException("Name already exists",HttpStatus.UNPROCESSABLE_ENTITY);
        }

        newProject.name = createProjectDto.name;
        newProject.tasks=[];
        
        if(!createProjectDto.managerId){
            return await this.projectRepository.save(newProject)
        }

        const manager = await this.getManager(createProjectDto.managerId);
        if(!manager){
            throw new HttpException("User with that id either doesnt exist or is not manager",HttpStatus.UNPROCESSABLE_ENTITY);
        }
        
        if(await this.isManagerTaken(manager.id)){
            throw new HttpException("Manager already working on another project", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return await this.projectRepository.save(newProject);                                  
    }

    
    async updateProject(id:number, createProjectDto:CreateProjectDto){
        const project = await this.projectRepository.findOne({
            where:{
                id:id
            }
        })
        if(!project){
            throw new HttpException("Project doesnt exist", HttpStatus.NOT_FOUND);
        }

        if(await this.isNameTakenByOtherProject(createProjectDto.name,id)){
            throw new HttpException("New name already exists", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        project.name = createProjectDto.name; 

        if(createProjectDto.managerId === null){
            project.manager=null;
            return await this.projectRepository.save(project);
        }

        if(!createProjectDto.managerId){
            return await this.projectRepository.save(project);
        }
       
        const manager = await this.getManager(createProjectDto.managerId);
        if(!manager){
            throw new HttpException("User with that id either doesnt exist or is not manager",HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if(await this.isManagerTaken(manager.id)){
                throw new HttpException("Manager already working on another project", HttpStatus.UNPROCESSABLE_ENTITY);
            } 

        project.manager=manager;
     
    
        return await this.projectRepository.save(project);
    }


    async updateProjectAsManager(managerId:number,createProjectDto:CreateProjectDto){
        
        if(await this.isNameTakenByOtherProject(createProjectDto.name,managerId)){
            throw new HttpException("New name already exists", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return await this.projectRepository.createQueryBuilder("project")
                    .update(ProjectsEntity)
                    .set( {name: createProjectDto.name })
                    .where("managerId = :id", {id:managerId})
                    .execute();
    
    }
    
    async paginate(options: IPaginationOptions, user):Promise<Pagination<ProjectsEntity>>  {
        if(RoleNameEnum.ADMIN===user.role){
            const projectAndUsers =  this.projectRepository.createQueryBuilder("p")
                                    .innerJoinAndSelect("p.users","user")
                                    .innerJoinAndSelect("user.role","role");
            return paginate(projectAndUsers,options);
        }

        const projectAndUsers = this.projectRepository.createQueryBuilder("p")
                                        .innerJoinAndSelect("p.users","users")
                                        .where("users.id=:id",{id:user.id})
                                        
        
            return paginate(projectAndUsers,options);
    }                                   


    async deleteProject(id:number){
        return await this.projectRepository.delete(id);
    }


    //checks if manager is already assigned to another project
    async isManagerTaken(id:number):Promise<boolean>{
        return await this.projectRepository
                         .createQueryBuilder("project")
                         .where("project.managerId = :id", {id:id})
                         .getExists();
    }


    async getManager(id:number):Promise<UserEntity>{
        return await this.userRepository
                         .createQueryBuilder("user")
                         .where("user.id=:id AND user.roleId=:manager",{id:id,manager:2})
                         .getOne();
    }


    async isNameTakenByOtherProject(name:string, id:number){
        return await this.projectRepository
                         .createQueryBuilder("project")
                         .where("project.name=:name AND project.id !=:id",{name:name,id:id})
                         .getExists()
    }

   
}
