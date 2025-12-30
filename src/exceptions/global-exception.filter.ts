import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import { ExceptionResponse } from './exception-response';
import { IHttpErrorParam } from './interfaces/http-error-param.interface';
import { extractValidationErrorMessages } from '../utils/class-validator.util';

/**
 * Global filter for catching and handling all application exceptions
 *
 * This filter intercepts all errors thrown in the application and converts them
 * into standardized responses, handling different types of exceptions:
 * - ValidationError (class-validator validation errors)
 * - HttpException (explicit NestJS HTTP errors)
 * - Generic Error (unexpected errors)
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Main method that catches and handles all exceptions
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    if (this.isValidationError(exception)) {
      return this.handleValidationError(exception as ValidationError[], host);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, host);
    }

    this.handleUnexpectedError(exception, host);
  }

  /**
   * Checks if the error is a ValidationError
   */
  private isValidationError(exception: unknown): boolean {
    return (
      Array.isArray(exception) &&
      exception.length > 0 &&
      exception[0] instanceof ValidationError
    );
  }

  /**
   * Handles class-validator validation errors
   *
   * Recursively extracts all error messages,
   * including nested object validations.
   */
  private handleValidationError(
    errors: ValidationError[],
    host: ArgumentsHost,
  ): void {
    const errorMessages = extractValidationErrorMessages(errors);
    const firstMessage =
      errorMessages[0] || 'Validation error in the provided data';

    const exceptionResponse = new ExceptionResponse(
      HttpStatus.BAD_REQUEST,
      firstMessage,
      errorMessages,
    );

    exceptionResponse.send(host);
  }

  /**
   * Handles explicit HTTP errors (HttpException)
   */
  private handleHttpException(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const status = exception.getStatus();
    const response = exception.getResponse() as string | IHttpErrorParam;

    const exceptionResponse = ExceptionResponse.fromHttpError(status, response);

    exceptionResponse.send(host);
  }

  /**
   * Handles unexpected errors (Generic Error)
   *
   * Logs the complete error to the console with stack trace
   * and returns a generic response to the client with UUID
   * for tracking.
   */
  private handleUnexpectedError(exception: unknown, host: ArgumentsHost): void {
    const timestamp = new Date().toISOString();
    const uuid = uuidv4();

    const line = '='.repeat(80);

    this.logger.error(line);
    this.logger.error('Unexpected error caught');
    this.logger.error(`Timestamp: ${timestamp}`);
    this.logger.error(`UUID: ${uuid}`);

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(`${JSON.stringify(exception)}`);
    }

    this.logger.error(line);

    const exceptionResponse = ExceptionResponse.internalError(uuid);

    exceptionResponse.send(host);
  }
}
