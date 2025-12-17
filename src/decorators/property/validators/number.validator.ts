import { IsNumber, IsInt, Min, Max } from 'class-validator';

import { NumberValidationOptions } from '@decorators';
import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildNumberValidators(
  propertyName: string,
  validation: NumberValidationOptions,
): PropertyDecorator[] {
  const decorators: PropertyDecorator[] = [];

  if (validation.integerOnly) {
    decorators.push(
      IsInt({
        message: applyMessage(propertyName, EValidationErrorMessages.INTEGER),
      }),
    );
  } else {
    decorators.push(
      IsNumber(
        {},
        {
          message: applyMessage(propertyName, EValidationErrorMessages.NUMBER),
        },
      ),
    );
  }

  if (validation.min !== undefined) {
    decorators.push(
      Min(validation.min, {
        message: applyMessage(propertyName, EValidationErrorMessages.MIN, {
          min: validation.min,
        }),
      }),
    );
  }

  if (validation.max !== undefined) {
    decorators.push(
      Max(validation.max, {
        message: applyMessage(propertyName, EValidationErrorMessages.MAX, {
          max: validation.max,
        }),
      }),
    );
  }

  if (validation.allowNegative === false) {
    decorators.push(
      Min(0, {
        message: applyMessage(
          propertyName,
          EValidationErrorMessages.POSITIVE_NUMBER,
        ),
      }),
    );
  }

  if (validation.allowPositive === false) {
    decorators.push(
      Max(0, {
        message: applyMessage(
          propertyName,
          EValidationErrorMessages.NEGATIVE_NUMBER,
        ),
      }),
    );
  }

  return decorators;
}
