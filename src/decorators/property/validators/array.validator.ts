import { IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

import { ArrayValidationOptions } from '@decorators';
import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildArrayValidators(
  propertyName: string,
  validation: ArrayValidationOptions,
): PropertyDecorator[] {
  const decorators: PropertyDecorator[] = [
    IsArray({
      message: applyMessage(propertyName, EValidationErrorMessages.ARRAY),
    }),
  ];

  if (validation.minLength) {
    decorators.push(
      ArrayMinSize(validation.minLength, {
        message: applyMessage(
          propertyName,
          EValidationErrorMessages.MIN_ELEMENTS,
          {
            min: validation.minLength,
          },
        ),
      }),
    );
  }

  if (validation.maxLength) {
    decorators.push(
      ArrayMaxSize(validation.maxLength, {
        message: applyMessage(
          propertyName,
          EValidationErrorMessages.MAX_ELEMENTS,
          {
            max: validation.maxLength,
          },
        ),
      }),
    );
  }

  return decorators;
}
