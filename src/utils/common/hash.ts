import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';

const SALT_ROUNDS = 10;

export const hash = (password: string): Promise<string> => bcryptHash(password, SALT_ROUNDS);

export const compareHash = (data: string, encrypted: string): Promise<boolean> => bcryptCompare(data, encrypted);
