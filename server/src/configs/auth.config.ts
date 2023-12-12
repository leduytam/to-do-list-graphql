import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { IAuthConfig } from './types/config.interface';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;
}

export default registerAs<IAuthConfig>('auth', (): IAuthConfig => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  };
});
