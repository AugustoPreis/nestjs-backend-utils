import { IsEmail } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

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
