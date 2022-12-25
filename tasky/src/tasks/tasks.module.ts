import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEntity } from './models/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TasksEntity])],
  providers: [TasksService],
  controllers: [TasksController]
})
export class TasksModule {}
