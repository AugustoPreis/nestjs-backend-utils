import { INestApplication, ValidationPipeOptions } from '@nestjs/common';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { extractValidationErrorMessages } from '../utils/class-validator.util';

/**
 * Default configuration for ValidationPipe
 *
 * Defines recommended values for validation and automatic
 * data transformation in NestJS applications.
 */
const DEFAULT_VALIDATION_OPTIONS: ValidationPipeOptions = {
  whitelist: true, // Removes non-decorated properties
  transform: true, // Enables automatic type transformation
  forbidNonWhitelisted: false, // Does not reject extra properties
  transformOptions: {
    enableImplicitConversion: true, // Automatic type conversion
  },
};

/**
 * Helper class to configure ValidationPipe with standardized error handling
 *
 * Provides optimized configuration of NestJS ValidationPipe with automatic
 * integration to the custom exception system. Converts validation errors
 * from class-validator into formatted exceptions.
 */
export class ValidationPipeConfig {
  /**
   * Configures the application's global ValidationPipe
   *
   * Applies default settings and integrates with the exception system,
   * automatically converting ValidationError[] to standardized format.
   */
  public static configure(
    app: INestApplication,
    options: ValidationPipeOptions = {},
  ): void {
    app.useGlobalPipes(this.create(options));
  }

  /**
   * Creates the exception factory for ValidationPipe
   *
   * Converts ValidationError array to BadRequestException
   * that will be caught by GlobalExceptionFilter and formatted
   * appropriately.
   */
  private static createExceptionFactory(): (
    errors: ValidationError[],
  ) => BadRequestException {
    return (errors: ValidationError[]) => {
      return new BadRequestException({
        message: extractValidationErrorMessages(errors),
      });
    };
  }

  /**
   * Creates a configured ValidationPipe instance
   *
   * Useful for applying validation to specific modules or controllers.
   */
  public static create(options: ValidationPipeOptions = {}): ValidationPipe {
    return new ValidationPipe({
      ...DEFAULT_VALIDATION_OPTIONS,
      ...options,
      exceptionFactory: this.createExceptionFactory(),
    });
  }
}
