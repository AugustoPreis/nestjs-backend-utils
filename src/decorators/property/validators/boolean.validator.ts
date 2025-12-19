import { IsBoolean } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

export function buildBooleanValidators(
  propertyName: string,
): PropertyDecorator[] {
  return [
    IsBoolean({
      message: applyMessage(propertyName, EValidationErrorMessages.BOOLEAN),
    }),
  ];
}
