import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('to_do_lists')
export class ToDoList {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: String })
  name: string;

  @Field()
  @Column({ type: String, default: '' })
  description: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.toDoLists)
  user: User;

  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.toDoList, {
    cascade: true,
  })
  tasks: Task[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
