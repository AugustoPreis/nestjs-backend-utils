import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Converte string para maiúscula
 */
export function ToUpperCase(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'number') return value.toString();
    if (typeof value !== 'string') return value;

    return value.toUpperCase();
  });
}
