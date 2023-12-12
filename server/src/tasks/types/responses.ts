import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateTaskResponse {
  @Field()
  message: string;
}

@ObjectType()
export class DeleteTaskResponse {
  @Field()
  message: string;
}

@ObjectType()
export class RearrangeTasksResponse {
  @Field()
  message: string;
}
