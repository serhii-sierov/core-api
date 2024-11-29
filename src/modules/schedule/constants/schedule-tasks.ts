import { DEFAULT_REPEAT_TIMEZONE } from './common';

import { TaskName, TaskOptions } from '../types';

export const scheduleTasks: Record<TaskName, TaskOptions> = {
  [TaskName.CLEANUP_AUTH]: {
    repeat: {
      tz: DEFAULT_REPEAT_TIMEZONE,
      pattern: '0 0 * * *', // Every day at 0:00 AM
      // every: 60000, // Test: Every minute
    },
    autoStart: true,
  },
};
