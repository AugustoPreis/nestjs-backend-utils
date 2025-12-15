import { IsUrl } from 'class-validator';

import { applyMessage } from '@utils';
import { EValidationErrorMessages } from '@constants';

export function buildUrlValidators(propertyName: string): PropertyDecorator[] {
  return [
    IsUrl(
      {},
      {
        message: applyMessage(propertyName, EValidationErrorMessages.URL),
      },
    ),
  ];
}
