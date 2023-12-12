import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateToDoListInput } from './dto/create-to-do-list.input';
import { UpdateToDoListInput } from './dto/update-to-do-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ToDoList } from './entities/to-do-list.entity';

@Injectable()
export class ToDoListsService {
  constructor(
    @InjectRepository(ToDoList)
    private repo: Repository<ToDoList>,
  ) {}

  async create(input: CreateToDoListInput, userId: string) {
    const toDoList = this.repo.create({
      ...input,
      user: {
        id: userId,
      },
    });

    return this.repo.save(toDoList);
  }

  findOne(
    conditions: FindOptionsWhere<ToDoList> | FindOptionsWhere<ToDoList>[],
  ) {
    return this.repo.findOne({
      where: conditions,
      relations: ['user', 'tasks'],
    });
  }

  findAll(
    conditions: FindOptionsWhere<ToDoList> | FindOptionsWhere<ToDoList>[],
  ) {
    return this.repo.find({
      where: conditions,
      relations: ['user', 'tasks'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  update(id: string, input: UpdateToDoListInput) {
    return this.repo.update(id, input);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  async checkAuthorizedUser(id: string, userId: string) {
    const toDoList = await this.findOne({
      id,
    });

    if (!toDoList) {
      throw new NotFoundException('To-do list not found');
    }

    if (toDoList.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }

    return toDoList;
  }
}
