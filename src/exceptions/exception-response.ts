import { HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { IExceptionResponse } from './interfaces/exception-response.interface';
import { IHttpErrorParam } from './interfaces/http-error-param.interface';

/**
 * Main class for standardizing HTTP error responses
 *
 * Provides a consistent structure for returning errors to the client,
 * including HTTP status, main message and detailed error array.
 */
export class ExceptionResponse implements IExceptionResponse {
  public readonly message: string;
  public readonly errors: string[];
  public readonly statusCode: number;
  public readonly uuid?: string;

  public constructor(
    statusCode: number,
    message: string,
    errors: string[] = [],
    uuid?: string,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.uuid = uuid;
  }

  /**
   * Builds the standardized response object
   */
  public build(): IExceptionResponse {
    const response: IExceptionResponse = {
      message: this.message,
      errors: this.errors,
      statusCode: this.statusCode,
      uuid: this.uuid,
    };

    return response;
  }

  /**
   * Automatically sends the error response to the client
   *
   * Uses NestJS ArgumentsHost to send
   * the formatted HTTP response.
   */
  public send(host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(this.statusCode).json(this.build());
  }

  /**
   * Creates an ExceptionResponse from a standard HTTP error
   */
  public static fromHttpError(
    statusCode: HttpStatus,
    message: string | IHttpErrorParam,
  ): ExceptionResponse {
    if (typeof message === 'string') {
      return new ExceptionResponse(statusCode, message);
    }

    if (Array.isArray(message.message)) {
      const firstMessage = message.message[0] || 'Validation error';
      return new ExceptionResponse(statusCode, firstMessage, message.message);
    }

    return new ExceptionResponse(statusCode, message.message);
  }

  /**
   * Creates an ExceptionResponse for internal server errors
   */
  public static internalError(uuid: string): ExceptionResponse {
    return new ExceptionResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      `An internal server error occurred. ID: ${uuid}`,
      [],
      uuid,
    );
  }
}
