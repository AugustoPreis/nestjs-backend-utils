import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Converts string to lowercase
 */
export function ToLowerCase(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'number') return value.toString();
    if (typeof value !== 'string') return value;

    return value.toLowerCase();
  });
}
