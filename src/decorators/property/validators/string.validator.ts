import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

import { StringValidationOptions } from '@decorators';
import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildStringValidators(
  propertyName: string,
  validation: StringValidationOptions,
): PropertyDecorator[] {
  const decorators: PropertyDecorator[] = [
    IsString({
      message: applyMessage(propertyName, EValidationErrorMessages.STRING),
    }),
  ];

  if (validation.minLength) {
    decorators.push(
      MinLength(validation.minLength, {
        message: applyMessage(
          propertyName,
          EValidationErrorMessages.MIN_LENGTH,
          {
            minLength: validation.minLength,
          },
        ),
      }),
    );
  }

  if (validation.maxLength) {
    decorators.push(
      MaxLength(validation.maxLength, {
        message: applyMessage(
          propertyName,
          EValidationErrorMessages.MAX_LENGTH,
          {
            maxLength: validation.maxLength,
          },
        ),
      }),
    );
  }

  if (validation.pattern) {
    decorators.push(
      Matches(validation.pattern, {
        message: applyMessage(propertyName, EValidationErrorMessages.PATTERN),
      }),
    );
  }

  return decorators;
}
