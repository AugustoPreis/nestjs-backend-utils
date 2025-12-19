import { IsOptional } from 'class-validator';

import {
  ArrayValidationOptions,
  NumberValidationOptions,
  PropertyOptions,
  StringValidationOptions,
} from '../interfaces/property-options.interface';
import { PropertyType } from '../enums/property-type.enum';
import { buildArrayValidators } from '../validators/array.validator';
import { buildBooleanValidators } from '../validators/boolean.validator';
import { buildDateValidators } from '../validators/date.validator';
import { buildEmailValidators } from '../validators/email.validator';
import { buildEnumValidators } from '../validators/enum.validator';
import { buildJsonValidators } from '../validators/json.validator';
import { buildNumberValidators } from '../validators/number.validator';
import { buildObjectValidators } from '../validators/object.validator';
import { buildStringValidators } from '../validators/string.validator';
import { buildUrlValidators } from '../validators/url.validator';
import { buildUuidValidators } from '../validators/uuid.validator';

export function buildValidationDecorators(
  options: PropertyOptions,
): PropertyDecorator[] {
  const decorators: PropertyDecorator[] = [];
  const { type, name, validation = {}, enumValues, required = true } = options;
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
