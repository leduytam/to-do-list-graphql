import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.repo.create(createUserInput);
    return this.repo.save(user);
  }

  findOne(
    conditions: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User> {
    return this.repo.findOne({
      where: conditions,
    });
  }
}
