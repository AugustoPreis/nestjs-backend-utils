import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Remove espaços em branco do início e fim da string
 */
export function Trim(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'number') return value.toString();
    if (typeof value !== 'string') return value;

    return value.trim();
  });
}
