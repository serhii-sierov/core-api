import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  transform<T = unknown>(value: T): T {
    const { error } = this.schema.validate(value);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return value;
  }
}
