import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  message: string;
}

@ObjectType()
export class RefreshResponse {
  @Field()
  accessToken: string;
}
