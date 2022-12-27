import { Body,
         Controller, 
         DefaultValuePipe, 
         Delete, 
         Get, 
         Param, 
         ParseIntPipe, 
         Patch, 
         Post, 
         Query, 
         UseGuards,
         Request } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateTaskDto } from 'src/tasks/dto/createTask.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { RoleNameEnum } from 'src/user/types/role.enum';
import { CreateProjectDto } from './dto/create.project.dto';
import { ProjectsEntity } from './models/projects.entity';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService){}

    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Post()
    async createProject(@Body() createProjectDto: CreateProjectDto){
        return await this.projectService.createProject(createProjectDto);                                
    }



    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Patch('/:id')
    async updateProject(@Param('id',ParseIntPipe)id:number, @Body() createProjectDto: CreateProjectDto){
        
        return await this.projectService.updateProject(id,createProjectDto)
    }

    @Roles(RoleNameEnum.MANAGER)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Patch('')
    async updateProjectAsManager(@Request() req, @Body() CreateProjectDto:CreateProjectDto){
        return await this.projectService.updateProjectAsManager(req.user.id,CreateProjectDto);
       
    
    }

    // : Promise<Pagination<ProjectsEntity>>

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getProjects(
        @Request() req,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,)  {
            limit = limit > 100 ? 100 : limit;
            return this.projectService.paginate({
                page,
                limit,
            }, req.user);
    }

    @Roles(RoleNameEnum.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Delete('/:id')
    async deleteProject(@Param('id',ParseIntPipe) id:number){
        return await this.projectService.deleteProject(id)
    }

    // @Roles(RoleNameEnum.ADMIN)
    // @UseGuards(JwtAuthGuard,RolesGuard)
    // @Get('/:id')
    // async readProjectWithTasks(@Param('id', ParseIntPipe) id:number){
    //     return await this.projectService.readProjectWithTasks(id);
    // }


}
