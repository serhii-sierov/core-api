import { Job, RepeatOptions } from 'bullmq';

export enum TaskName {
  CLEANUP_AUTH = 'CleanupAuth',
}

export type TaskOptions = {
  repeat: RepeatOptions;
  autoStart?: boolean;
};

export type ScheduleTaskOptions<DataType, ResultType> = {
  repeat?: RepeatOptions;
  opts?: Omit<Job<DataType, ResultType, TaskName>['opts'], 'jobId' | 'repeat' | 'delay'>;
};

export type TaskHandler<DataType = any, ResultType = void> = (
  job: Job<DataType, ResultType, TaskName>,
) => Promise<ResultType>;

export interface TaskProcessor<DataType = any, ResultType = void> {
  handle: TaskHandler<DataType, ResultType>;
}
