import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateToDoListResponse {
  @Field()
  message: string;
}

@ObjectType()
export class DeleteToDoListResponse {
  @Field()
  message: string;
}
