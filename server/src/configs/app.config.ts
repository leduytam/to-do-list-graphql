import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { IAppConfig } from './types/config.interface';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;
}

export default registerAs<IAppConfig>('app', (): IAppConfig => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: process.env.PORT ? +process.env.PORT : 8080,
  };
});
