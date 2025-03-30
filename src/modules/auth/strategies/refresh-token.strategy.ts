import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from 'modules/shared/modules/config';
import { UserService } from 'modules/user/services';
import { AppRequest, ContextUser } from 'types';

import { JwtPayload } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    protected configService: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: AppRequest): string | null => {
          const token = request?.cookies['refreshToken'];

          if (!token) {
            return null;
          }

          return token;
        },
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('jwt').refreshToken.secret,
    });
  }

  async validate(_req: AppRequest, payload: JwtPayload): Promise<ContextUser> {
    const sessionId = payload.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({ where: { id: Number(payload.sub), sessions: { sessionId } } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, sessionId, email: user.email };
  }
}
