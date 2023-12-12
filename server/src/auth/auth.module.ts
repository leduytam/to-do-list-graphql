import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/refresh-jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { IConfig } from 'src/configs/types/config.interface';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService<IConfig>) => ({
        secret: config.get('auth.jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: config.get('auth.jwt.expiresIn', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
