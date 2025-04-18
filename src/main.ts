import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as requestIp from 'request-ip';

import { AppConfigService } from 'modules/shared/modules/config/config.service';

import { AppModule } from './app.module';
import { ValidationFilter } from './filters/validation.filter';

async function bootstrap(): Promise<void> {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ValidationFilter());
  app.use(cookieParser());
  app.use(requestIp.mw());

  const configService = app.get(AppConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}

void bootstrap();
