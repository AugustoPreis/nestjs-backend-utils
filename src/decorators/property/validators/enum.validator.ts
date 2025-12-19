import { IsEnum } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

export function buildEnumValidators(
  propertyName: string,
  enumValues: unknown,
): PropertyDecorator[] {
  return [
    IsEnum(enumValues as object, {
      message: applyMessage(propertyName, EValidationErrorMessages.ENUM),
    }),
  ];
}
