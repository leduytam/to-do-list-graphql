import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IConfig } from 'src/configs/types/config.interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig>) => {
        return {
          type: configService.get('db.type', { infer: true }),
          host: configService.get('db.host', { infer: true }),
          port: configService.get('db.port', { infer: true }),
          username: configService.get('db.username', {
            infer: true,
          }),
          password: configService.get('db.password', {
            infer: true,
          }),
          db: configService.get('db.name', { infer: true }),
          synchronize: true,
          dropSchema: false,
          keepConnectionAlive: true,
          autoLoadEntities: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          cli: {
            entitiesDir: 'src',
            migrationsDir: 'src/db/migrations',
          },
          namingStrategy: new SnakeNamingStrategy(),
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
