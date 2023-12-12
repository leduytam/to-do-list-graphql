import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateTaskInput {
  @Field()
  @IsUUID('4')
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field({ nullable: true })
  @IsBoolean()
  isCompleted: boolean;
}
