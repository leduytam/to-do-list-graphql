import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
}
