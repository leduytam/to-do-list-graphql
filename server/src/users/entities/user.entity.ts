import { ObjectType, Field } from '@nestjs/graphql';
import { ToDoList } from 'src/to-do-lists/entities/to-do-list.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@ObjectType()
@Entity('users')
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: String, unique: true })
  username: string;

  @Column({ type: String })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Field()
  @Column({ type: String })
  name: string;

  @OneToMany(() => ToDoList, (toDoList) => toDoList.user)
  toDoLists: ToDoList[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @CreateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
