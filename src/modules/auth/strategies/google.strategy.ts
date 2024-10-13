import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  /*, VerifyCallback */
} from 'passport-google-oauth20';

import { AuthService } from '../services';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // constructor(private readonly userService: UserService) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    });
  }

  // async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
  //   const { email } = profile;

  //   let user = await this.userService.findOne(email);

  //   if (!user) {
  //     user = await this.userService.create({
  //       email,
  //       providers: [{ provider: 'google', providerId: profile.id }],
  //       password: null,
  //       refreshTokens: [],
  //     });
  //   } else {
  //     const existingProvider = user.providers.find(provider => provider.provider === 'google');

  //     if (!existingProvider) {
  //       await this.userService.addProvider(user, { provider: 'google', providerId: profile.id });
  //     }
  //   }

  //   return user;
  // }

  // eslint-disable-next-line @typescript-eslint/naming-convention -- This naming convention allowed here
  // async validateOAuthLogin(profile: any): Promise<UserEntity> {
  //   const { providerId, provider } = profile; // Extract providerId and provider type from profile

  //   // Check if a user already exists with the providerId
  //   let user = await this.providerRepository.findOne({
  //     where: { providerId, provider },
  //     relations: ['user'], // Include user relation to get associated User entity
  //   });

  //   if (!user) {
  //     // If user does not exist, create a new user
  //     const newUser = new UserEntity();
  //     newUser.email = profile.email; // Assuming profile has an email field
  //     newUser.providers = [{ provider, providerId }]; // Create a new provider entry

  //     // Save the new user
  //     user = await this.userRepository.save(newUser);
  //   }

  //   return user; // Return the existing or newly created user
  // }

  // async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
  //   const { name, emails } = profile;
  //   const user = await this.authService.validateOAuthLogin(emails[0].value, 'google', profile.id);

  //   return done(null, user);
  // }
}
