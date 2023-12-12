import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ToDoList } from 'src/to-do-lists/entities/to-do-list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('tasks')
export class Task {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column({ default: false })
  isCompleted: boolean;

  @Field(() => ToDoList)
  @ManyToOne(() => ToDoList, (toDoList) => toDoList.tasks)
  toDoList: ToDoList;

  @Field(() => Int)
  @Column({ type: Number })
  order: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
