import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppConfigService } from 'modules/shared/modules/config/config.service';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}

void bootstrap();
