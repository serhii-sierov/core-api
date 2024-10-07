import { Global, Module } from '@nestjs/common';
import { Format } from 'logform';
import { WinstonModule as NestWinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';
import { TypedConfigService } from '../config/config.service';

const getTransports = (configService: TypedConfigService): transports.ConsoleTransportInstance[] => {
  const defaultFormat: Format = format.combine(format.timestamp(), utilities.format.nestLike());

  const activeTransports: transports.ConsoleTransportInstance[] = [
    new transports.Console({
      format: defaultFormat,
      level: configService.get('LOG_LEVEL') ?? 'info',
    }),
  ];

  return activeTransports;
};

@Global()
@Module({
  imports: [
    NestWinstonModule.forRootAsync({
      useFactory: (configService: TypedConfigService) => ({
        transports: getTransports(configService),
      }),
      inject: [TypedConfigService],
    }),
  ],
})
export class LoggerModule {}
