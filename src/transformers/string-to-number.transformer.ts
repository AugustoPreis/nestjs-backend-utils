import { Transform, TransformFnParams } from 'class-transformer';

import { StringToNumberOptions } from './interfaces/string-to-number-options.interface';

/**
 * Converte string para número
 */
export function StringToNumber(
  options: StringToNumberOptions = {},
): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return options.fallback ?? value;

    const num = options.radix ? parseInt(value, options.radix) : Number(value);

    if (isNaN(num)) {
      return options.fallback ?? value;
    }

    return num;
  });
}
