import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../types/jwt-payload.interface';
import { IUserPayload } from '../types/user-payload.interface';
import { UsersService } from 'src/users/users.service';
import { IConfig } from 'src/configs/types/config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService<IConfig>,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.secret', { infer: true }),
    });
  }

  validate(payload: IJwtPayload): IUserPayload {
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
