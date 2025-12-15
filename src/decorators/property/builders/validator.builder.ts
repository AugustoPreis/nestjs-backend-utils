import { IsOptional } from 'class-validator';

import {
  ArrayValidationOptions,
  buildArrayValidators,
  buildBooleanValidators,
  buildDateValidators,
  buildEmailValidators,
  buildEnumValidators,
  buildJsonValidators,
  buildNumberValidators,
  buildObjectValidators,
  buildStringValidators,
  buildUrlValidators,
  buildUuidValidators,
  NumberValidationOptions,
  PropertyOptions,
  PropertyType,
  StringValidationOptions,
} from '@decorators';

export function buildValidationDecorators(
  options: PropertyOptions,
): PropertyDecorator[] {
  const decorators: PropertyDecorator[] = [];
  const { type, name, validation, enumValues, required = true } = options;
  const propertyName = name || '?';

  if (!required) {
    decorators.push(IsOptional());
  }

  switch (type) {
    case PropertyType.STRING:
      decorators.push(
        ...buildStringValidators(
          propertyName,
          validation as StringValidationOptions,
        ),
      );
      break;

    case PropertyType.NUMBER:
      decorators.push(
        ...buildNumberValidators(
          propertyName,
          validation as NumberValidationOptions,
        ),
      );
      break;

    case PropertyType.BOOLEAN:
      decorators.push(...buildBooleanValidators(propertyName));
      break;

    case PropertyType.DATE:
      decorators.push(...buildDateValidators(propertyName));
      break;

    case PropertyType.EMAIL:
      decorators.push(...buildEmailValidators(propertyName));
      break;

    case PropertyType.UUID:
      decorators.push(...buildUuidValidators(propertyName));
      break;

    case PropertyType.URL:
      decorators.push(...buildUrlValidators(propertyName));
      break;

    case PropertyType.ARRAY:
      decorators.push(
        ...buildArrayValidators(
          propertyName,
          validation as ArrayValidationOptions,
        ),
      );
      break;

    case PropertyType.OBJECT:
      decorators.push(...buildObjectValidators(propertyName));
      break;

    case PropertyType.JSON:
      decorators.push(...buildJsonValidators(propertyName));
      break;

    case PropertyType.ENUM:
      if (enumValues) {
        decorators.push(...buildEnumValidators(propertyName, enumValues));
      }
      break;
  }

  return decorators;
}
