import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from 'src/user/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { RoleNameEnum } from 'src/user/types/role.enum';
import { CreateTaskDto } from './dto/createTask.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateTaskDto } from './dto/updateTasks.dto';
import { TasksEntity } from './models/tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private readonly taskService: TasksService){}

    @UsePipes(new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true,
        forbidUnknownValues: true
    }))
    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Post()
    async createTask(@Request() req, @Body() createTaskDto: CreateTaskDto){
        return await this.taskService.createTask(req.user.id, createTaskDto)
    }
    @UsePipes(new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true,
        forbidUnknownValues: true
    }))
    @UseGuards(JwtAuthGuard)
    @Post("/:id")
    async createTaskForProejct(@Request() req, @Param('id',ParseIntPipe) projectId:number, @Body() createTaskDto:CreateTaskDto){
       return await this.taskService.createTaskForProject(req.user,projectId,createTaskDto);
    }
    
    @UsePipes(new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true,
        forbidUnknownValues: true
    }))
    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    async updateTask(@Request() req ,@Param('id',ParseIntPipe) taskId:number, @Body() updateTaskDto: UpdateTaskDto){
        return await this.taskService.updateTask(req.user,taskId,updateTaskDto);
    }



    
    @UseGuards(JwtAuthGuard)
    @Get('')
    async getTasks(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query() filterDto:FilterDto,
        @Request() req){
            if(Object.keys(filterDto).length && req.user.role===RoleNameEnum.ADMIN){
                return await this.taskService.filterTasks({page,limit},filterDto);
            }else{
                limit = limit > 100 ? 100 : limit;
                    return this.taskService.paginate({
                     page,
                     limit,
                     },
                     req.user);
            }
    }
    

    @UsePipes(new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true,
        forbidUnknownValues: true
    }))
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteTask(@Request() req,@Param('id',ParseIntPipe) id:number ){
        return await this.taskService.deleteTask(req.user,id);
    }

    @UsePipes(new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true,
        forbidUnknownValues: true
    }))
   @UseGuards(JwtAuthGuard)
   @Get('/:id')
   async filterProjectTasks(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
                            @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
                            @Query('userId',ParseIntPipe) userId:number, @Param('id', ParseIntPipe) projectId){
        return await this.taskService.filterProjectsTasks({
                                                              page,
                                                              limit,
                                                          },projectId,userId);
   }


   
   



}