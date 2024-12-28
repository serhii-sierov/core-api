import { randomBytes } from 'crypto';

export const generateRandomSecret = (length = 32): string => {
  return randomBytes(length).toString('hex');
};
