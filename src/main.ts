import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AppConfigService } from 'modules/shared/modules/config/config.service';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configService = app.get(AppConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}

void bootstrap();
