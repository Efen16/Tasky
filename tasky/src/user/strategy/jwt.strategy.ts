import {Strategy, ExtractJwt} from 'passport-jwt'
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'shhsecret',
    });
  }

  async validate(payload: any) {
    return {
        id: payload.sub, 
        role: payload.role
    }
    
  }
}