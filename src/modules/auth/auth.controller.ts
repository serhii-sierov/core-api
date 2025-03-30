import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { IpAddress, UserAgent } from 'decorators';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { Public } from './decorators';
import { SignInInput } from './dto';
import { GoogleOauthGuard, RefreshTokenGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    // @Body('email') email: string,
    // @Body('password') password: string,
    @Body() { email, password }: SignInInput,
    @Res() res: Response,
  ) {
    console.log({ email, password });

    const session = await this.authService.signIn({ email, password }, res);

    res.status(201).json(session);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('token')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @UserAgent('summary') device?: string,
    @IpAddress() ipAddress?: string,
  ) {
    const refreshToken = req.cookies.refreshToken as string; // Guard ensures it is not undefined

    console.log('refresh token');

    const session = await this.authService.refreshToken(refreshToken, { ipAddress, device }, res);

    res.status(201).json(session);
  }

  @Post('google')
  @Public()
  @UseGuards(GoogleOauthGuard)
  oauth() {
    console.log('O auth');
  }

  // @Post('google/callback')
  // @UseGuards(GoogleOauthGuard)
  // googleAuthCallback(@Req() req, @Res() res: Response) {
  //   console.log('google auth callback');

  //   // const token = await this.authService.signIn(req.user);

  //   // res.cookie('access_token', token, {
  //   //   maxAge: 2592000000,
  //   //   sameSite: true,
  //   //   secure: false,
  //   // });

  //   // return res.status(HttpStatus.OK);
  // }
}
