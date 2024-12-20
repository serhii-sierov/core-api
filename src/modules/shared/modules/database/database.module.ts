import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      ...config(),
    }),
  ],
})
export class DatabaseModule {}
