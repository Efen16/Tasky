import { CacheModule, CacheStore, Module, CacheInterceptor } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './user/guards/roles.guard';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { dataSourceOptions } from './db/data-source';
import { RedisClientOptions } from 'redis';
// import * as redisStore from "cache-manager-redis-store"
import { APP_INTERCEPTOR } from '@nestjs/core';
const redisStore = require('cache-manager-redis-store').redisStore
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), 
            UserModule, 
            TasksModule, 
            ProjectsModule,
            CacheModule.register({
                                  isGlobal: true,
                                  //quick fix, cant find better one.
                                  //https://github.com/dabroek/node-cache-manager-redis-store/issues/53#issuecomment-1372944703
                                  store: redisStore,
                                  host: 'localhost',
                                  port: 6379}),
                                 
          ]
})
export class AppModule {
  
}
