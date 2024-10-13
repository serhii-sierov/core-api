import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// eslint-disable-next-line @typescript-eslint/naming-convention -- Allow uppercase for decorator
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);