import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  DeleteTaskResponse,
  RearrangeTasksResponse,
  UpdateTaskResponse,
} from './types/responses';
import { RearrangeTasksInput } from './dto/rearrange-tasks.input';
import { ToDoListsService } from 'src/to-do-lists/to-do-lists.service';

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    private tasksService: TasksService,
    private toDoListService: ToDoListsService,
  ) {}
  @UseGuards(JwtGuard)
  @Mutation(() => Task)
  createTask(@Args('task') input: CreateTaskInput) {
    return this.tasksService.create(input);
  }

  @UseGuards(JwtGuard)
  @Query(() => [Task], { name: 'getTasks' })
  findAll(
    @Args('toDoListId', new ParseUUIDPipe({ version: '4' })) toDoListId: string,
    @Context() context: any,
  ) {
    return this.tasksService.findAll({
      toDoList: {
        user: {
          id: context.req.user.id,
        },
        id: toDoListId,
      },
    });
  }

  @UseGuards(JwtGuard)
  @Query(() => Task, { name: 'getTask' })
  async findOne(
    @Args('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Context() context: any,
  ) {
    await this.tasksService.checkAuthorizedUser(id, context.req.user.id);

    return this.tasksService.findOne({
      id,
    });
  }

  @UseGuards(JwtGuard)
  @Mutation(() => UpdateTaskResponse)
  async updateTask(
    @Args('task') input: UpdateTaskInput,
    @Context() context: any,
  ) {
    await this.tasksService.checkAuthorizedUser(input.id, context.req.user.id);
    await this.tasksService.update(input.id, input);

    return {
      message: 'Task updated successfully',
    };
  }

  @UseGuards(JwtGuard)
  @Mutation(() => DeleteTaskResponse)
  async deleteTask(
    @Args('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Context() context: any,
  ) {
    await this.tasksService.checkAuthorizedUser(id, context.req.user.id);
    await this.tasksService.delete(id);

    return {
      message: 'Task deleted successfully',
    };
  }

  @UseGuards(JwtGuard)
  @Mutation(() => RearrangeTasksResponse)
  async rearrangeTasks(
    @Args('input') input: RearrangeTasksInput,
    @Context() context: any,
  ) {
    await this.toDoListService.checkAuthorizedUser(
      input.toDoListId,
      context.req.user.id,
    );

    await this.tasksService.rearrange(input);

    return {
      message: 'Tasks rearranged successfully',
    };
  }
}
