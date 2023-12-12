import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { IDbConfig } from './types/config.interface';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  DB_TYPE: string;

  @IsString()
  DB_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;
}

export default registerAs<IDbConfig>('db', (): IDbConfig => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'to_do_list_db',
  };
});
