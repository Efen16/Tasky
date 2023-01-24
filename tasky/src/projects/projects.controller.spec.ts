import {Test, TestingModule} from '@nestjs/testing'
import { DeleteResult } from 'typeorm';
import { UserEntity } from '../user/models/user.entity';
import { CreateProjectDto } from './dto/create.project.dto';
import { ProjectsEntity } from './models/projects.entity';
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
const httpMocks = require('node-mocks-http');




describe('ProjectController tests', ()=>{
    let projectController:ProjectsController
    let projectService: ProjectsService
    
    const reqUserMock = httpMocks.createRequest();
    reqUserMock.user = new UserEntity();
    reqUserMock.user.id = 1;

    const createProject: CreateProjectDto = {
        name: 'OneGoal',
    }

    const project = new ProjectsEntity();
    project.name = 'OneGoal';
    project.id =1;
    project.tasks = [];
    project.users = [];

    const project2 = new ProjectsEntity();
    project2.name = "someThing";
    project.id = 2;
    project.tasks = [];
    project.users = [];
    
    

    const mockProjectService = {
        createProject: jest.fn().mockImplementation(() => {return project }),
        updateProject: jest.fn().mockImplementation(() => {return project}),
        updateProjectAsManager: jest.fn().mockImplementation(()=> {return project}),
        paginate: jest.fn().mockImplementation(()=> {return {data:[project,project2], meta:{"totalItems": 2,
		                                                                                    "itemCount": 2,
		                                                                                    "itemsPerPage": 10,
		                                                                                    "totalPages": 1,
		                                                                                    "currentPage": 1}}}),
        deleteProject: jest.fn().mockImplementation(()=> {return new DeleteResult().affected=1})
    }

    beforeEach(async ()=>{
        const module:TestingModule = await Test.createTestingModule({
            controllers: [ProjectsController],
            providers: [
                {provide: ProjectsService, useValue: mockProjectService}
            ]

        }).compile()

        projectController = module.get<ProjectsController>(ProjectsController);
        projectService = module.get<ProjectsService>(ProjectsService);
        
    });

    it('should be defined', () => {
        expect(projectController).toBeDefined();
    })

    it('should create a project', async ()=> {
        expect(projectController.createProject(createProject)).resolves.toEqual(project);
    });

    it('should update the project', async ()=>{
        expect(projectController.updateProject(expect.any(Number),createProject)).resolves.toEqual(project);
    })

    it('should update the project as a manager', async ()=>{
        expect(projectController.updateProjectAsManager(reqUserMock,createProject)).resolves.toEqual(project);
    })
    
    it('should get all projects', async()=>{
        expect(projectController.getProjects(reqUserMock,1,10)).resolves.toEqual({data:[project,project2], meta:{"totalItems": 2,
        "itemCount": 2,
        "itemsPerPage": 10,
        "totalPages": 1,
        "currentPage": 1}})
    })

    it('should delete project', async ()=>{
        expect(projectController.deleteProject(1)).resolves.toEqual(new DeleteResult().affected=1)
    })

});

