import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { UserModule } from 'modules/user';

import { SCHEDULE_QUEUE_NAME } from './constants/common';
import { ScheduleQueueProcessor } from './schedule.processor';
import { ScheduleService } from './schedule.service';
import { CleanupAuthTaskProcessor } from './task-processors';

@Module({
  imports: [BullModule.registerQueue({ name: SCHEDULE_QUEUE_NAME }), UserModule],
  providers: [ScheduleService, ScheduleQueueProcessor, CleanupAuthTaskProcessor],
})
export class ScheduleModule {}
