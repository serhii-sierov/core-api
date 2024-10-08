import { UserTypes } from './user-types';

export type ContextUserType = {
  type: UserTypes;
  id: number;
  email?: string;
  timezone?: string;
  coreUserId?: number;
};
