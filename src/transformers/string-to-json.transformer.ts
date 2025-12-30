import { Transform, TransformFnParams } from 'class-transformer';

import { StringToJsonOptions } from './interfaces/string-to-json-options.interface';

/**
 * Converts JSON string to object
 */
export function StringToJson(
  options: StringToJsonOptions = {},
): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return value;

    try {
      return JSON.parse(value, options.reviver);
    } catch {
      return options.fallback ?? value;
    }
  });
}
