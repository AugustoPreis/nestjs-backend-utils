import { IsObject } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildJsonValidators(propertyName: string): PropertyDecorator[] {
  return [
    IsObject({
      message: applyMessage(propertyName, EValidationErrorMessages.JSON),
    }),
  ];
}
