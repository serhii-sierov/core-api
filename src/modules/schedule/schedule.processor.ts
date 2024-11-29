import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, LoggerService } from '@nestjs/common';
import { Job } from 'bullmq';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Message } from './constants';
import { SCHEDULE_QUEUE_NAME } from './constants/common';
import { CleanupAuthTaskProcessor } from './task-processors';
import { TaskName, TaskProcessor } from './types';

@Processor(SCHEDULE_QUEUE_NAME)
export class ScheduleQueueProcessor extends WorkerHost {
  private readonly taskProcessors: Record<TaskName, TaskProcessor>;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    private readonly cleanupAuthTaskHandler: CleanupAuthTaskProcessor,
  ) {
    super();
    this.taskProcessors = {
      [TaskName.CLEANUP_AUTH]: this.cleanupAuthTaskHandler,
    };
  }

  async process(job: Job<unknown, void, TaskName>): Promise<void> {
    this.loggerService.debug?.(`${Message.PROCESSING_SCHEDULED_TASK}: ${job.name}`, this.constructor.name);

    try {
      return await this.taskProcessors[job.name].handle(job);
    } catch (error) {
      this.loggerService.error?.(error, this.constructor.name);
    }
  }
}
