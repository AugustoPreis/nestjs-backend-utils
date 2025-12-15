import { IsObject, ValidateNested } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildObjectValidators(
  propertyName: string,
): PropertyDecorator[] {
  return [
    IsObject({
      message: applyMessage(propertyName, EValidationErrorMessages.OBJECT),
    }),
    ValidateNested(),
  ];
}
