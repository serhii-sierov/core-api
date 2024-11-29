import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from 'modules/shared/modules/config';
import { UserService } from 'modules/user/services';
import { AppRequest, ContextUser } from 'types';

import { JwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected configService: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: AppRequest): string | null => {
          const { accessToken } = req.cookies;

          if (!accessToken) {
            return null;
          }

          return accessToken;
        },
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('jwt').accessToken.secret,
    });
  }

  async validate(_req: AppRequest, payload: JwtPayload): Promise<ContextUser> {
    const user = await this.userService.findOne({ where: { id: Number(payload.sub) } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email };
  }
}
