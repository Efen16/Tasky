import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { TasksEntity } from '../tasks/models/tasks.entity';
import { UserEntity } from '../user/models/user.entity';
import { RoleNameEnum } from '../user/types/role.enum';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
    ){}


    async createProject(createProjectDto:CreateProjectDto):Promise<ProjectsEntity>{
        const newProject:ProjectsEntity = new ProjectsEntity();
        const nameTaken = await this.projectRepository 
                              .createQueryBuilder("project")
                              .where("project.name = :name",{name:createProjectDto.name})
                              .getExists();
        
        if(nameTaken){
            throw new HttpException("Name already exists",HttpStatus.UNPROCESSABLE_ENTITY);
        }

        newProject.name = createProjectDto.name;
        
        if(!createProjectDto.managerId){
            return await this.projectRepository.save(newProject)
        }

        const manager = await this.getManager(createProjectDto.managerId);
 
        await this.isManagerTaken(manager.id);
       
        newProject.manager=manager

        return await this.projectRepository.save(newProject);                                  
    }

    
    async updateProject(id:number, createProjectDto:CreateProjectDto): Promise<ProjectsEntity>{
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
 
        await this.isManagerTaken(createProjectDto.managerId);

        project.manager=manager;
     
        return await this.projectRepository.save(project);
    }


    async updateProjectAsManager(managerId:number,createProjectDto:CreateProjectDto):Promise<UpdateResult>{
        
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
                                    .leftJoinAndSelect("p.users","user")
                                    .leftJoinAndSelect("user.role","role");
            return paginate(projectAndUsers,options);
        }

        const projectAndUsers = this.projectRepository.createQueryBuilder("p")
                                        .innerJoinAndSelect("p.users","users")
                                        .where("users.id=:id",{id:user.id})
                                               
        return paginate(projectAndUsers,options);
    }                                   


    async deleteProject(id:number):Promise<DeleteResult>{
        return await this.projectRepository.delete(id);
    }


    async isManagerTaken(id:number):Promise<void>{
       const isTaken = await this.projectRepository
                         .createQueryBuilder("project")
                         .where("project.managerId = :id", {id:id})
                         .getExists();
        if(isTaken){
            throw new HttpException("Manager already working on another project", HttpStatus.UNPROCESSABLE_ENTITY);
        }

       
    }

    
    async getManager(id:number):Promise<UserEntity>{
        const manager = await this.userRepository
                         .createQueryBuilder("user")
                         .where("user.id=:id AND user.roleId=:manager",{id:id,manager:2})
                         .getOne();
        
        if(!manager){
            throw new HttpException("User with that id either doesnt exist or is not manager",HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return manager;
    }


    async isNameTakenByOtherProject(name:string, id:number):Promise<boolean>{
        return await this.projectRepository
                         .createQueryBuilder("project")
                         .where("project.name=:name AND project.id !=:id",{name:name,id:id})
                         .getExists()
    }

   
}
