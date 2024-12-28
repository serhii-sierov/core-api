import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, LoggerService, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppConfigService } from 'modules/shared/modules/config';

import { Message } from './constants';
import { SCHEDULE_QUEUE_NAME } from './constants/common';
import { scheduleTasks } from './constants/schedule-tasks';
import { ScheduleTaskOptions, TaskName } from './types';

@Injectable()
export class ScheduleService<DataType = any, ResultType = void> implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectQueue(SCHEDULE_QUEUE_NAME)
    private readonly scheduleQueue: Queue<DataType, ResultType, TaskName, DataType, ResultType, TaskName>,
    private readonly configService: AppConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    // Don't run in test mode
    if (this.configService.isTest()) {
      return;
    }

    // Clear the queue in case of a server restart or a new deployment
    await this.scheduleQueue.obliterate({ force: true });

    await this.initScheduleQueue();
  }

  async onModuleDestroy(): Promise<void> {
    await this.scheduleQueue.obliterate();
  }

  scheduleTask(
    name: TaskName,
    data?: DataType | null,
    options?: ScheduleTaskOptions<DataType, ResultType>,
  ): Promise<Job<DataType, ResultType, TaskName>> {
    const taskOptions = scheduleTasks[name];
    const { repeat = taskOptions.repeat, opts } = options ?? {};

    this.loggerService.debug?.(`${Message.SCHEDULING_TASK}: ${name}`, this.constructor.name);

    return this.scheduleQueue.upsertJobScheduler(name, repeat, {
      data: data ?? undefined,
      opts: { removeOnComplete: true, ...opts },
    });
  }

  removeTask(name: TaskName): Promise<boolean> {
    this.loggerService.debug?.(`${Message.REMOVING_SCHEDULED_TASK}: ${name}`, this.constructor.name);

    return this.scheduleQueue.removeJobScheduler(name);
  }

  private async initScheduleQueue(): Promise<void> {
    await Promise.all(
      Object.entries(scheduleTasks)
        .filter(([, { autoStart }]) => autoStart)
        .map(([name]) => this.scheduleTask(name as keyof typeof scheduleTasks)),
    );
  }
}
