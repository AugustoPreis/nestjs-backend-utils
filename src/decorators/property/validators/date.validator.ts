import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildDateValidators(propertyName: string): PropertyDecorator[] {
  return [
    IsDate({
      message: applyMessage(propertyName, EValidationErrorMessages.DATE),
    }),
    Type(() => Date),
  ];
}
