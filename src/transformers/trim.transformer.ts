import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Removes whitespace from beginning and end of string
 */
export function Trim(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'number') return value.toString();
    if (typeof value !== 'string') return value;

    return value.trim();
  });
}
