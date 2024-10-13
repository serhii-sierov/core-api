import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from 'modules/shared/modules/config';
import { UserService } from 'modules/user/services';
import { AppRequest } from 'types';

import { JwtPayload } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    protected configService: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: AppRequest) => {
          const token = request?.cookies['refreshToken'];

          if (!token) {
            return null;
          }

          return token;
        },
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('jwt.refreshToken.secret'),
    });
  }

  async validate(_req: AppRequest, payload: JwtPayload) {
    const user = await this.userService.findOne({ where: { id: Number(payload.sub) } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email };
  }
}
