import { IsUUID } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildUuidValidators(propertyName: string): PropertyDecorator[] {
  return [
    IsUUID(undefined, {
      message: applyMessage(propertyName, EValidationErrorMessages.UUID),
    }),
  ];
}
