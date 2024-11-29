import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as requestIp from 'request-ip';

import { AppConfigService } from 'modules/shared/modules/config/config.service';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(requestIp.mw());

  const configService = app.get(AppConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}

void bootstrap();
