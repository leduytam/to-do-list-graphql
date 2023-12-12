import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import appConfig from './configs/app.config';
import dbConfig from './configs/db.config';
import authConfig from './configs/auth.config';
import { ToDoListsModule } from './to-do-lists/to-do-lists.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, authConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: `${process.cwd()}/src/schema.gql`,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DatabaseModule,
    ToDoListsModule,
    TasksModule,
  ],
})
export class AppModule {}
