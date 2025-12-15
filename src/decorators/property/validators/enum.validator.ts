import { IsEnum } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

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
