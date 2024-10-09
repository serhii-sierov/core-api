import { Global, Module } from '@nestjs/common';
import { Format } from 'logform';
import { WinstonModule as NestWinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';
import { AppConfigService } from '../config/config.service';

const getTransports = (configService: AppConfigService): transports.ConsoleTransportInstance[] => {
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
      useFactory: (configService: AppConfigService) => ({
        transports: getTransports(configService),
      }),
      inject: [AppConfigService],
    }),
  ],
})
export class LoggerModule {}
