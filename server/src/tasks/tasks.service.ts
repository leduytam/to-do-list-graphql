import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RearrangeTasksInput } from './dto/rearrange-tasks.input';
import { ToDoListsService } from 'src/to-do-lists/to-do-lists.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>,
    private toDoListService: ToDoListsService,
  ) {}

  async create(input: CreateTaskInput) {
    const countTasks = await this.repo.count({
      where: {
        toDoList: {
          id: input.toDoListId,
        },
      },
    });

    const task = this.repo.create({
      ...input,
      order: countTasks + 1,
      toDoList: {
        id: input.toDoListId,
      },
    });

    return this.repo.save(task);
  }

  findAll(conditions: FindOptionsWhere<Task> | FindOptionsWhere<Task>[]) {
    return this.repo.find({
      where: conditions,
      relations: ['toDoList', 'toDoList.user'],
    });
  }

  findOne(conditions: FindOptionsWhere<Task> | FindOptionsWhere<Task>[]) {
    return this.repo.findOne({
      where: conditions,
      relations: ['toDoList', 'toDoList.user'],
      order: {
        order: 'ASC',
      },
    });
  }

  update(id: string, input: UpdateTaskInput) {
    return this.repo.update(id, input);
  }

  async delete(id: string) {
    const task = await this.findOne({
      id,
    });

    const toDoListId = task.toDoList.id;

    let tasks = await this.repo.find({
      where: {
        toDoList: {
          id: toDoListId,
        },
      },
      order: {
        order: 'ASC',
      },
    });

    tasks = tasks.filter((t) => t.id !== id);

    await this.repo.delete(id);

    const promises = tasks.map((task, index) =>
      this.repo.update(task.id, {
        order: index + 1,
      }),
    );

    await Promise.all(promises);
  }

  async rearrange(input: RearrangeTasksInput) {
    const { toDoListId, tasks } = input;

    const toDoList = await this.toDoListService.findOne({
      id: toDoListId,
    });

    if (!toDoList) {
      throw new NotFoundException('To-do list not found');
    }

    if (toDoList.tasks.length !== tasks.length) {
      throw new BadRequestException(
        'The number of tasks in the request does not match the number of tasks in the database',
      );
    }

    // Check if the ids of the tasks in the request match the ids of the tasks in the database
    let isTaskIdsValid = true;

    for (const task of input.tasks) {
      const taskInDb = toDoList.tasks.find((t) => t.id === task.id);

      if (!taskInDb) {
        isTaskIdsValid = false;
        break;
      }
    }

    if (!isTaskIdsValid) {
      throw new BadRequestException(
        'The id of a task in the request does not match the id of a task in the database',
      );
    }

    // Check if the orders of the tasks in the request are valid
    let isTaskOrdersValid = true;

    // Check if the orders of the tasks in the request are unique
    const orders = tasks.map((task) => task.order);
    const uniqueOrders = [...new Set(orders)];

    if (orders.length !== uniqueOrders.length) {
      isTaskOrdersValid = false;
    }

    // Check if the orders of the tasks in the request are consecutive
    const sortedOrders = orders.sort((a, b) => a - b);

    if (sortedOrders[0] !== 1) {
      isTaskOrdersValid = false;
    }

    for (let i = 0; i < sortedOrders.length - 1; i++) {
      if (sortedOrders[i + 1] - sortedOrders[i] !== 1) {
        isTaskOrdersValid = false;
        break;
      }
    }

    if (!isTaskOrdersValid) {
      throw new BadRequestException(
        'The orders of the tasks in the request are invalid',
      );
    }

    const promises = tasks.map((task) =>
      this.repo.update(task.id, {
        order: task.order,
      }),
    );

    await Promise.all(promises);
  }

  async checkAuthorizedUser(id: string, userId: string) {
    const task = await this.findOne({
      id,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.toDoList.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }

    return task;
  }
}
