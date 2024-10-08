import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { TypedConfigService } from 'modules/shared/modules/config/config.service';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const configService = app.get(TypedConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}

void bootstrap();
