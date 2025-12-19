import { IsObject } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

export function buildJsonValidators(propertyName: string): PropertyDecorator[] {
  return [
    IsObject({
      message: applyMessage(propertyName, EValidationErrorMessages.JSON),
    }),
  ];
}
