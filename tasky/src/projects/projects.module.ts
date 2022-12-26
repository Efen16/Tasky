import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './models/projects.entity';
import { UserEntity } from 'src/user/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEntity,UserEntity])],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
