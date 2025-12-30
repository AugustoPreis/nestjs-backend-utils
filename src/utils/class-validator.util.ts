import { ValidationError } from '@nestjs/common';

import { EValidationErrorMessages } from '../constants/validation-error-messages.constant';

/**
 * Extracts all error messages from ValidationError array
 *
 * Recursively processes validation errors, including
 * nested object validations.
 */
export function extractValidationErrorMessages(
  errors: ValidationError[],
  parentPath: string = '',
): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      const constraintMessages = Object.values(error.constraints);
      messages.push(...constraintMessages);
    }

    if (error.children && error.children.length > 0) {
      const childMessages = extractValidationErrorMessages(
        error.children,
        propertyPath,
      );

      messages.push(...childMessages);
    }
  }

  return messages;
}

export function applyMessage(
  fieldName: string,
  message: EValidationErrorMessages,
  values?: Record<string, unknown>,
): string {
  let finalMessage = message.replace('{field}', fieldName);

  if (values) {
    for (const [key, value] of Object.entries(values)) {
      finalMessage = finalMessage.replace(`{${key}}`, String(value));
    }
  }

  return finalMessage;
}
