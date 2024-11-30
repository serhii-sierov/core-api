import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { HttpClientInfo } from 'decorators';
import { Response } from 'express';

import { ContextUser, GqlContext } from 'types';

import { CurrentUser, Public } from './decorators';
import { ChangePasswordInput, SignInInput, SignInResponse, SignOutInput, SignUpInput, SignUpResponse } from './dto';
import { RefreshTokenGuard } from './guards';
import { AuthService } from './services';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignUpResponse)
  signUp(
    @Args('input') input: SignUpInput,
    @Context('res') res: Response,
    @HttpClientInfo('summary') device: string,
  ): Promise<SignUpResponse> {
    return this.authService.signUp(input, res, device);
  }

  @Public()
  @Mutation(() => SignInResponse)
  signIn(
    @Args('input') input: SignInInput,
    @Context() context: GqlContext,
    @HttpClientInfo('summary') device: string,
  ): Promise<SignInResponse> {
    // TODO: Implement ip address geo location lookup using https://ipgeolocation.io/
    const { req, res } = context;
    const { refreshToken } = req.cookies;

    return this.authService.signIn(input, res, device, refreshToken);
  }

  @Mutation(() => Boolean)
  async signOut(
    @Args('input') input: SignOutInput,
    @Context() context: GqlContext,
    @CurrentUser() currentUser: ContextUser,
  ): Promise<boolean> {
    const { useAllDevices } = input ?? {};
    const { req, res } = context;
    const { refreshToken } = req.cookies;

    await this.authService.signOut({ userId: currentUser.id, refreshToken, useAllDevices }, res);

    return true;
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Mutation(() => Boolean)
  refreshToken(@Context() context: GqlContext, @HttpClientInfo('summary') device: string): Promise<boolean> {
    const { req, res } = context;
    const { refreshToken } = req.cookies;

    return this.authService.refreshToken({ refreshToken, device }, res);
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
  // TODO: Implement cleanup expired refresh tokens in queue
  // TODO: Implement email confirmation mutation
}
