import { Trim, ToLowerCase, ToUpperCase } from '@transformers';
import { PropertyOptions } from '@decorators';

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
