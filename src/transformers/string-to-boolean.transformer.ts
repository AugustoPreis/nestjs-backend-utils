import { Transform, TransformFnParams } from 'class-transformer';

import { StringToBooleanOptions } from './interfaces/string-to-boolean-options.interface';

/**
 * Converts string to boolean
 */
export function StringToBoolean(
  options: StringToBooleanOptions = {},
): PropertyDecorator {
  const trueValues = options.trueValues || ['true', '1', 'yes', 'on'];
  const falseValues = options.falseValues || ['false', '0', 'no', 'off'];

  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;

    if (typeof value === 'string') {
      const val =
        options.caseInsensitive !== false ? value.toLowerCase() : value;

      if (trueValues.includes(val)) return true;
      if (falseValues.includes(val)) return false;
    }

    return value;
  });
}
