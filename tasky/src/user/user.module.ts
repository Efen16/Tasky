import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { RoleEntity } from './models/role.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ProjectsEntity } from 'src/projects/models/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, ProjectsEntity]),PassportModule, JwtModule.register({
    secret: "shhsecret"
  }) ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController]
})
export class UserModule {}
