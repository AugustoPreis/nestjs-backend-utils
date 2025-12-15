import { IsBoolean } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildBooleanValidators(
  propertyName: string,
): PropertyDecorator[] {
  return [
    IsBoolean({
      message: applyMessage(propertyName, EValidationErrorMessages.BOOLEAN),
    }),
  ];
}
