import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PropertyOptions } from './interfaces/property-options.interface';
import { buildSwaggerOptions } from './builders/swagger.builder';
import { buildTransformDecorators } from './builders/transformer.builder';
import { buildValidationDecorators } from './builders/validator.builder';

export function Property(options: PropertyOptions): PropertyDecorator {
  const decorators: PropertyDecorator[] = [];
  const { required = true } = options;

  const swaggerOptions = buildSwaggerOptions(options);

  decorators.push(...buildTransformDecorators(options));
  decorators.push(...buildValidationDecorators(options));
  decorators.push(
    required
      ? ApiProperty(swaggerOptions)
      : ApiPropertyOptional(swaggerOptions),
  );

  return applyDecorators(...decorators);
}
