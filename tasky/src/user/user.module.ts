import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { RoleEntity } from './models/role.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]),PassportModule, JwtModule.register({
    secret: "shhsecret"
  }) ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController]
})
export class UserModule {}
