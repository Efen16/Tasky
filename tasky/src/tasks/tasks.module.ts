import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEntity } from './models/tasks.entity';
import { ProjectsEntity } from 'src/projects/models/projects.entity';
import { UserEntity } from 'src/user/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TasksEntity,ProjectsEntity,UserEntity])],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService]

})
export class TasksModule {}
