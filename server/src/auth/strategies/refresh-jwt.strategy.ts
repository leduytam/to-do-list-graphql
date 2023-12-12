import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserPayload } from '../types/user-payload.interface';
import { IConfig } from 'src/configs/types/config.interface';
import { IJwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService<IConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: configService.get('auth.jwt.refreshSecret', { infer: true }),
    });
  }

  validate(payload: IJwtPayload): IUserPayload {
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
