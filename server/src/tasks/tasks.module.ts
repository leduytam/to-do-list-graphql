import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ToDoListsModule } from 'src/to-do-lists/to-do-lists.module';

@Module({
  providers: [TasksResolver, TasksService],
  exports: [TasksService],
  imports: [TypeOrmModule.forFeature([Task]), ToDoListsModule],
})
export class TasksModule {}
