import { ApiPropertyOptions } from '@nestjs/swagger';

import {
  NumberValidationOptions,
  PropertyOptions,
  PropertyType,
  StringValidationOptions,
} from '@decorators';

export function buildSwaggerOptions(
  options: PropertyOptions,
): ApiPropertyOptions {
  const {
    type,
    name,
    description,
    example,
    defaultValue,
    swagger = {},
    validation,
    enumValues,
  } = options;

  const swaggerOptions: ApiPropertyOptions = {
    description: description || name,
    example: example,
    ...swagger,
  };

  if (defaultValue !== undefined) {
    swaggerOptions.default = defaultValue;
  }

  switch (type) {
    case PropertyType.STRING: {
      swaggerOptions.type = 'string';
      const stringRules = validation as StringValidationOptions;

      swaggerOptions.minLength =
        stringRules.minLength ?? swaggerOptions.minLength;
      swaggerOptions.maxLength =
        stringRules.maxLength ?? swaggerOptions.maxLength;
      break;
    }

    case PropertyType.NUMBER: {
      swaggerOptions.type = 'number';
      const numberRules = validation as NumberValidationOptions;

      swaggerOptions.minimum = numberRules.min ?? swaggerOptions.minimum;
      swaggerOptions.maximum = numberRules.max ?? swaggerOptions.maximum;
      break;
    }

    case PropertyType.BOOLEAN:
      swaggerOptions.type = 'boolean';
      break;

    case PropertyType.DATE:
      swaggerOptions.type = 'string';
      swaggerOptions.format = 'date-time';
      break;

    case PropertyType.EMAIL:
      swaggerOptions.type = 'string';
      swaggerOptions.format = 'email';
      break;

    case PropertyType.UUID:
      swaggerOptions.type = 'string';
      swaggerOptions.format = 'uuid';
      break;

    case PropertyType.URL:
      swaggerOptions.type = 'string';
      swaggerOptions.format = 'uri';
      break;

    case PropertyType.ARRAY:
      swaggerOptions.isArray = true;
      break;

    case PropertyType.ENUM:
      swaggerOptions.enum = enumValues
        ? Object.values(enumValues as object)
        : swaggerOptions.enum;
      break;
  }

  return swaggerOptions;
}
