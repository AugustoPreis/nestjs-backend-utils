import { Trim } from '../../../transformers/trim.transformer';
import { ToLowerCase } from '../../../transformers/to-lowercase.transformer';
import { ToUpperCase } from '../../../transformers/to-uppercase.transformer';
import { PropertyOptions } from '../interfaces/property-options.interface';

export function buildTransformDecorators(
  options: PropertyOptions,
): PropertyDecorator[] {
  const decorators: PropertyDecorator[] = [];
  const { transform } = options;

  if (!transform) return decorators;

  if (transform.trim) decorators.push(Trim());
  if (transform.toLowerCase) decorators.push(ToLowerCase());
  if (transform.toUpperCase) decorators.push(ToUpperCase());

  return decorators;
}
