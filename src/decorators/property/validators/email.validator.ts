import { IsEmail } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

export function buildEmailValidators(
  propertyName: string,
): PropertyDecorator[] {
  return [
    IsEmail(
      {},
      {
        message: applyMessage(propertyName, EValidationErrorMessages.EMAIL),
      },
    ),
  ];
}
