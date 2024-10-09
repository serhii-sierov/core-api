import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AppConfigService } from 'modules/shared/modules/config/config.service';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}

void bootstrap();
