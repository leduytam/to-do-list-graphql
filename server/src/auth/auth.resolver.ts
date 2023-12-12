import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { RefreshInput } from './dto/refresh.input';
import { JwtGuard } from './guards/jwt.guard';
import {
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from './types/responses';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginResponse)
  logIn(
    @Args('user')
    _loginInput: LoginInput,
    @Context() ctx: any,
  ) {
    return this.authService.login(ctx.req.user);
  }

  @Mutation(() => RegisterResponse)
  register(@Args('user') registerInput: RegisterInput) {
    const input: RegisterInput = JSON.parse(JSON.stringify(registerInput));
    return this.authService.register(input);
  }

  @UseGuards(JwtGuard)
  @Query(() => User)
  me(@Context() ctx: any) {
    return this.authService.getMe(ctx.req.user);
  }

  @UseGuards(RefreshJwtGuard)
  @Mutation(() => RefreshResponse)
  refresh(@Args('refresh') _refreshInput: RefreshInput, @Context() ctx: any) {
    return this.authService.refresh(ctx.req.user);
  }
}
