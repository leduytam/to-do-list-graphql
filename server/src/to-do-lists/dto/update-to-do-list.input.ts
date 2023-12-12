import { IsUUID } from 'class-validator';
import { CreateToDoListInput } from './create-to-do-list.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateToDoListInput extends PartialType(CreateToDoListInput) {
  @Field()
  @IsUUID('4')
  id: string;
}
