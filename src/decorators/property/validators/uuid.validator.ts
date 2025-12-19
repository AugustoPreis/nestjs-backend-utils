import { IsUUID } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

export function buildUuidValidators(propertyName: string): PropertyDecorator[] {
  return [
    IsUUID(undefined, {
      message: applyMessage(propertyName, EValidationErrorMessages.UUID),
    }),
  ];
}
