import { IsUrl } from 'class-validator';

import { applyMessage } from '../../../utils/class-validator.util';
import { EValidationErrorMessages } from '../../../constants/validation-error-messages.constant';

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
