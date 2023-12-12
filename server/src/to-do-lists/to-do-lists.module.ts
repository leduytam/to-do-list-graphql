import { Module } from '@nestjs/common';
import { ToDoListsService } from './to-do-lists.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoList } from './entities/to-do-list.entity';
import { ToDoListsResolver } from './to-do-lists.resolver';

@Module({
  providers: [ToDoListsResolver, ToDoListsService],
  exports: [ToDoListsService],
  imports: [TypeOrmModule.forFeature([ToDoList]), UsersModule],
})
export class ToDoListsModule {}
