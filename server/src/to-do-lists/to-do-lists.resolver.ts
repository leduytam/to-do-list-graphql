import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ToDoListsService } from './to-do-lists.service';
import { ToDoList } from './entities/to-do-list.entity';
import { CreateToDoListInput } from './dto/create-to-do-list.input';
import { UpdateToDoListInput } from './dto/update-to-do-list.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  DeleteToDoListResponse,
  UpdateToDoListResponse,
} from './types/responses';

@Resolver(() => ToDoList)
export class ToDoListsResolver {
  constructor(private readonly toDoListsService: ToDoListsService) {}

  @UseGuards(JwtGuard)
  @Mutation(() => ToDoList)
  createToDoList(
    @Args('toDoList') input: CreateToDoListInput,
    @Context() ctx: any,
  ) {
    return this.toDoListsService.create(input, ctx.req.user.id);
  }

  @UseGuards(JwtGuard)
  @Query(() => ToDoList, { name: 'getToDoList' })
  async findOne(
    @Args('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Context() ctx: any,
  ) {
    await this.toDoListsService.checkAuthorizedUser(id, ctx.req.user.id);

    return await this.toDoListsService.findOne({
      id,
    });
  }

  @UseGuards(JwtGuard)
  @Query(() => [ToDoList], { name: 'getToDoLists' })
  async findAll(@Context() ctx: any) {
    return this.toDoListsService.findAll({
      user: {
        id: ctx.req.user.id,
      },
    });
  }

  @UseGuards(JwtGuard)
  @Mutation(() => UpdateToDoListResponse)
  async updateToDoList(
    @Args('toDoList')
    input: UpdateToDoListInput,
    @Context() ctx: any,
  ): Promise<UpdateToDoListResponse> {
    await this.toDoListsService.checkAuthorizedUser(input.id, ctx.req.user.id);

    await this.toDoListsService.update(input.id, input);

    return {
      message: 'Updated successfully',
    };
  }

  @UseGuards(JwtGuard)
  @Mutation(() => DeleteToDoListResponse)
  async deleteToDoList(
    @Args('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Context() ctx: any,
  ) {
    await this.toDoListsService.checkAuthorizedUser(id, ctx.req.user.id);

    await this.toDoListsService.delete(id);

    return {
      message: 'Deleted successfully',
    };
  }
}
