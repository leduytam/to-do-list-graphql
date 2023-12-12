import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class RearrangeTaskInput {
  @Field()
  @IsUUID('4')
  id: string;

  @Field(() => Int)
  @IsNumber()
  order: number;
}

type IRearrangeTask = RearrangeTaskInput;

@InputType()
export class RearrangeTasksInput {
  @Field()
  @IsUUID('4')
  toDoListId: string;

  @Field(() => [RearrangeTaskInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RearrangeTaskInput)
  tasks: IRearrangeTask[];
}
