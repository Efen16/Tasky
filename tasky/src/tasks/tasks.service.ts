import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ProjectsEntity } from 'src/projects/models/projects.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTasks.dto';
import { TasksEntity } from './models/tasks.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksEntity)
        private readonly taskRepository: Repository<TasksEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProjectsEntity)
        private readonly projectRepository: Repository<ProjectsEntity>
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

            newTask.asignee = assignedUser;
        }

        if(createTaskDto.project_id){
            const project = await this.getProject(createTaskDto.project_id);
            if(!project){
                throw new HttpException("Project doesn't exist", HttpStatus.NOT_FOUND);
            }

            newTask.project = project;
        }

        return await this.taskRepository.save(newTask);
    }

    async updateTask(taskId:number, updateTaskDto: UpdateTaskDto){
        if(updateTaskDto.title){
            if(await this.titleTakenByAnotherTask(updateTaskDto.title,taskId)){
                throw new HttpException("Title has been already taken by another task", HttpStatus.UNPROCESSABLE_ENTITY);
            }
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

            task.asignee = user;
        }

        if(updateTaskDto.project_id){
            const project = await this.getProject(updateTaskDto.project_id);
            if(!project){
                throw new HttpException("Project doesnt exist", HttpStatus.NOT_FOUND);
            }

            task.project=project;
        }

        return await this.taskRepository.save(task);
    }


    async paginate(options: IPaginationOptions): Promise<Pagination<TasksEntity>> {
        return paginate<TasksEntity>(this.taskRepository, options);
      }

    
    async deleteTask(id:number){
        return await this.taskRepository.delete(id);
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
                }});
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
}
