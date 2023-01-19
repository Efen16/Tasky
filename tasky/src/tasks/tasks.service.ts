import { HttpException, HttpStatus, Injectable, ParseBoolPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ProjectsEntity } from 'src/projects/models/projects.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { RoleNameEnum } from 'src/user/types/role.enum';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateTaskDto } from './dto/updateTasks.dto';
import { TasksEntity } from './models/tasks.entity';
import { SortByPriority } from './types/sort.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksEntity)
        private readonly taskRepository: Repository<TasksEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProjectsEntity)
        private readonly projectRepository: Repository<ProjectsEntity>,
    ){}

    async createTask(createdById: number, createTaskDto: CreateTaskDto){
        
        if(await this.doesTitleExist(createTaskDto.title)){
            throw new HttpException("Title already taken", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        
        const newTask = new TasksEntity();
        Object.assign(newTask,createTaskDto);
        const creator = await this.getUser(createdById);
        newTask.createdBy = creator;

        if(createTaskDto.assignee_id){
            const assignedUser = await this.getUser(createTaskDto.assignee_id);
            if(!assignedUser){
                throw new HttpException("User to whom taks is assigned doesn't exist", HttpStatus.NOT_FOUND);
            }

            newTask.assignee = assignedUser;
        }

        if(createTaskDto.project_id){
            const project = await this.getProject(createTaskDto.project_id);
            if(!project){
                throw new HttpException("Project doesn't exist", HttpStatus.NOT_FOUND);
            }

            newTask.project = project;
           
            this.projectRepository.save(project);
        }
        
        return await this.taskRepository.save(newTask);
    }

    async updateTask(user,taskId:number, updateTaskDto: UpdateTaskDto){
        if(updateTaskDto.title){
            if(await this.titleTakenByAnotherTask(updateTaskDto.title,taskId)){
                throw new HttpException("Title has been already taken by another task", HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }

        if(user.role != RoleNameEnum.ADMIN){
            await this.isAssignedToProject(user.id,taskId);    
        }

        const task = await this.taskRepository.findOne({
            where:{
                id:taskId
            }});
        
        if(!task){
            throw new HttpException("Task doesn't exist", HttpStatus.NOT_FOUND);
        }

        Object.assign(task,updateTaskDto);

        if(updateTaskDto.assignee_id){
            const user = await this.getUser(updateTaskDto.assignee_id);
            if(!user){
                throw new HttpException("User with that id doesnt exist", HttpStatus.NOT_FOUND);
            }

            console.log("I am here");
            task.assignee = user;
            
        }

        if(updateTaskDto.project_id){
            const project = await this.getProject(updateTaskDto.project_id);
            if(!project){
                throw new HttpException("Project doesnt exist", HttpStatus.NOT_FOUND);
            }

            task.project=project;
         
        }

        console.log(task)
        return await this.taskRepository.save(task);
    }


    async createTaskForProject(user, projectId:number, createTaskDto:CreateTaskDto){

        const isAssigned = await this.projectRepository.createQueryBuilder("p")     
                      .innerJoinAndSelect("p.users","user")
                      .where("user.id = :id AND p.id=:project_id", {id:user.id, project_id:projectId})
                      .getExists();
        if(!isAssigned){
            throw new HttpException("Cant create task for this project",HttpStatus.UNAUTHORIZED);
        }

        createTaskDto.project_id=projectId;
        return await this.createTask(user.id,createTaskDto);
    }


    async paginate(options: IPaginationOptions, user): Promise<Pagination<TasksEntity>> {
        if(user.role===RoleNameEnum.ADMIN){
            return paginate<TasksEntity>(this.taskRepository, options);
        }

        const tasksQuery = await this.taskRepository.createQueryBuilder("t")
        .innerJoinAndSelect(ProjectsEntity, "p", "t.projectId=p.id")
        .innerJoinAndSelect("p.users","user")
        .where("user.id=:id",{id:user.id});
        
        return paginate<TasksEntity>(tasksQuery,options);
    }

    
    async deleteTask(user,taskId:number){
        if(user.role != RoleNameEnum.ADMIN){
            await this.isAssignedToProject(user.id,taskId);
        }
        return await this.taskRepository.delete(taskId);
    }

    
    async getUser(id:number): Promise<UserEntity>{
        return await this.userRepository.findOne({
            where:{
                id:id
            }});
    }


    async getProject(id:number):Promise<ProjectsEntity>{
        return await  this.projectRepository.findOne({
            where:{
                id:id
                }
            });
        }


    async doesTitleExist(title:string): Promise<boolean>{
        return await this.taskRepository.createQueryBuilder("task")
        .where("task.title = :title", {title: title})
        .getExists();
    }


    async titleTakenByAnotherTask(title:string, id:number):Promise<boolean>{
        return await this.taskRepository.createQueryBuilder("task")
        .where("task.title = :title AND task.id !=:id", {title: title, id:id})
        .getExists();
    }


    async isAssignedToProject(userId:number,taskId:number){
        const isAssigned = await this.taskRepository.createQueryBuilder("t")
                                .where("t.id=:id",{id:taskId})
                                .innerJoinAndSelect(ProjectsEntity, "p", "t.projectId=p.id")         
                                .innerJoinAndSelect("p.users","user","user.id=:userId",{userId:userId})
                                .getExists();        
        if(!isAssigned){
            throw new HttpException("Cant alter this task, user not assigned to project",HttpStatus.UNAUTHORIZED);
        }

        return isAssigned
    }
    
    
    async filterProjectsTasks(options: IPaginationOptions, projectId:number, userId:number){
        console.log(userId);
        const tasksQuery = await this.taskRepository.createQueryBuilder("t")
                            .where("t.projectId=:projectId",{projectId})
                            .innerJoin("t.assignee","user","user.id=:userId",{userId:userId});

      return paginate<TasksEntity>(tasksQuery,options);
    }

    
    async filterTasks(options: IPaginationOptions, filterDto:FilterDto){
        let {completed,sort,assignees,title} = filterDto;
        
        let tasks = this.taskRepository.createQueryBuilder("t");

        if(completed !== undefined){
            console.log(completed);
            tasks.where("t.completed=:isCompleted",{isCompleted:completed});
        }

        if(sort !== undefined){
            if(sort === "ASC" || sort === "DESC"){
                tasks.orderBy("t.priority", sort);
            }
        }

        if(assignees!==undefined){
            tasks.where("t.assigneeId IN (:...assignees)", {assignees: assignees})
        }

        if(title !== undefined){
            tasks.where("t.title=:title",{title:title});
        }

        return paginate<TasksEntity>(tasks,options);
       
    }
}
