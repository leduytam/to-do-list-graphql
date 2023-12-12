import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { IUserPayload } from './types/user-payload.interface';
import { RegisterInput } from './dto/register.input';
import { JwtService } from '@nestjs/jwt';
import { IConfig } from 'src/configs/types/config.interface';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<IConfig>,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<IUserPayload | null> {
    const user = await this.usersService.findOne({
      username,
    });

    if (user && bcrypt.compareSync(pass, user.password)) {
      return {
        id: user.id,
        username: user.username,
      };
    }

    return null;
  }

  async login(userPayload: IUserPayload) {
    const payload: IJwtPayload = {
      sub: userPayload.id,
      username: userPayload.username,
    };

    const user = await this.usersService.findOne({
      id: userPayload.id,
    });

    return {
      user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('auth.jwt.refreshSecret', {
          infer: true,
        }),
        expiresIn: this.configService.get('auth.jwt.refreshExpiresIn', {
          infer: true,
        }),
      }),
    };
  }

  async register(registerInput: RegisterInput) {
    const existingUser = await this.usersService.findOne({
      username: registerInput.username,
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    await this.usersService.create(registerInput);

    return {
      message: 'Successfully registered',
    };
  }

  async getMe(userPayload: IUserPayload) {
    return await this.usersService.findOne({
      id: userPayload.id,
    });
  }

  async refresh(userPayload: IUserPayload) {
    const payload: IJwtPayload = {
      sub: userPayload.id,
      username: userPayload.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
