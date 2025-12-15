import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  PropertyOptions,
  buildSwaggerOptions,
  buildTransformDecorators,
  buildValidationDecorators,
} from '@decorators';

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
