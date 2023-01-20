import {Strategy, ExtractJwt} from 'passport-jwt'
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { UserService } from '../user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    const id:number = payload.sub;
    const name = await this.userService.getUsersRole(id);
    return {
        id: id, 
        role: name
    }
    
  }
}