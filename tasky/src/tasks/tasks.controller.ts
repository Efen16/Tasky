import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from 'src/user/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { RoleNameEnum } from 'src/user/types/role.enum';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTasks.dto';
import { TasksEntity } from './models/tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private readonly taskService: TasksService){}

    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Post()
    async createTask(@Request() req, @Body() createTaskDto: CreateTaskDto){
        return await this.taskService.createTask(req.user.id, createTaskDto)
    }
    
    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('/:id')
    async updateTask(@Param('id',ParseIntPipe) taskId:number, @Body() updateTaskDto: UpdateTaskDto){
        return await this.taskService.updateTask(taskId,updateTaskDto);
    }


    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get('')
    async getTasks(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,): Promise<Pagination<TasksEntity>> {
            limit = limit > 100 ? 100 : limit;
            return this.taskService.paginate({
                page,
                limit,
            });
    }

    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Delete('/:id')
    async deleteTask(@Param('id',ParseIntPipe) id:number ){
        return await this.taskService.deleteTask(id);
    }


}
