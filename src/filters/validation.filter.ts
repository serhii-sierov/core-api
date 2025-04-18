import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { GraphQLError } from 'graphql';

interface HttpExceptionResponse {
  statusCode?: number;
  message: string | string[];
  error?: string;
}

@Catch(BadRequestException, ValidationError)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException | ValidationError, _host: ArgumentsHost): never {
    if (exception instanceof ValidationError) {
      const constraints = Object.values(exception.constraints || {});

      throw new GraphQLError(constraints.join('; '), {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: constraints,
        },
      });
    }

    // Handle BadRequestException
    const response = exception.getResponse() as HttpExceptionResponse;
    const message = response.message || exception.message;

    throw new GraphQLError(Array.isArray(message) ? message.join('; ') : message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        validationErrors: Array.isArray(message) ? message : [message],
      },
    });
  }
}
