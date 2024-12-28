import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { IpAddress, UserAgent } from 'decorators';
import { Response } from 'express';

import { ContextUser, GqlContext } from 'types';

import { AuthService } from './auth.service';
import { CurrentUser, Public } from './decorators';
import { ChangePasswordInput, SignInInput, SignInResponse, SignUpInput, SignUpResponse } from './dto';
import { RefreshTokenGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignUpResponse)
  signUp(
    @Args('input') input: SignUpInput,
    @Context('res') res: Response,
    @UserAgent('summary') device?: string,
    @IpAddress() ipAddress?: string,
  ): Promise<SignUpResponse> {
    return this.authService.signUp(input, res, { ipAddress, device });
  }

  @Public()
  @Mutation(() => SignInResponse)
  signIn(
    @Args('input') input: SignInInput,
    @Context() context: GqlContext,
    @UserAgent('summary') device?: string,
    @IpAddress() ipAddress?: string,
  ): Promise<SignInResponse> {
    const { req, res } = context;
    const { refreshToken } = req.cookies;

    return this.authService.signIn(input, res, { ipAddress, device }, refreshToken);
  }

  @Mutation(() => Boolean)
  signOut(@Context('res') res: Response, @CurrentUser() currentUser: ContextUser): Promise<boolean> {
    return this.authService.signOut(currentUser.sessionId, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Mutation(() => Boolean)
  refreshToken(
    @Context() context: GqlContext,
    @UserAgent('summary') device?: string,
    @IpAddress() ipAddress?: string,
  ): Promise<boolean> {
    const { req, res } = context;

    const refreshToken = req.cookies.refreshToken as string; // Guard ensures it is not undefined

    return this.authService.refreshToken(refreshToken, { ipAddress, device }, res);
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentUser() currentUser: ContextUser,
  ): Promise<boolean> {
    const { oldPassword, newPassword } = input;

    return this.authService.changePassword(oldPassword, newPassword, currentUser.id);
  }

  // TODO: Implement reset password mutation
  // TODO: Implement email confirmation mutation
}
