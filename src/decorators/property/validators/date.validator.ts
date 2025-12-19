import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

export function buildDateValidators(propertyName: string): PropertyDecorator[] {
  return [
    IsDate({
      message: applyMessage(propertyName, EValidationErrorMessages.DATE),
    }),
    Type(() => Date),
  ];
}
