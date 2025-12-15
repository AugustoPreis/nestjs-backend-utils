import { ValidationError } from '@nestjs/common';

/**
 * Extrai todas as mensagens de erro do array de ValidationError
 *
 * Processa recursivamente erros de validação, incluindo
 * validações de objetos aninhados.
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
