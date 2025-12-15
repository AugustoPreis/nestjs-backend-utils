import { parse } from 'date-fns';

import { Transform, TransformFnParams } from 'class-transformer';

import { StringToDateOptions } from '@transformers';

/**
 * Converte string para Date
 */
export function StringToDate(
  options: StringToDateOptions = {},
): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value);

    if (typeof value !== 'string') return value;

    try {
      if (!options.format || options.format === 'ISO') {
        return new Date(value);
      }

      return parse(value, options.format, new Date());
    } catch {
      return value;
    }
  });
}
