import { IsObject, ValidateNested } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

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
