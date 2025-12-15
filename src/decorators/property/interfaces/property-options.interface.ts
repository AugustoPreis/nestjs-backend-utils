import { ApiPropertyOptions } from '@nestjs/swagger';

import { PropertyType } from '@decorators';

type AllValidationOptions =
  | StringValidationOptions
  | NumberValidationOptions
  | ArrayValidationOptions
  | ObjectValidationOptions
  | JsonValidationOptions;

export interface StringTransformOptions {
  trim?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface NumberValidationOptions {
  min?: number;
  max?: number;
  integerOnly?: boolean;
  allowNegative?: boolean;
  allowPositive?: boolean;
}

export interface ArrayValidationOptions {
  minLength?: number;
  maxLength?: number;
}

export interface ObjectValidationOptions {
  requiredKeys?: string[];
  optionalKeys?: string[];
  allowAdditional?: boolean;
}

export interface JsonValidationOptions {
  maxDepth?: number;
  allowString?: boolean;
}

export interface PropertyOptions {
  name?: string;
  type: PropertyType;
  required?: boolean;
  defaultValue?: unknown;
  swagger?: ApiPropertyOptions;
  transform?: StringTransformOptions;
  enumValues?: unknown;
  arrayItemType?: PropertyType;
  description?: string;
  example?: unknown;
  validation?: AllValidationOptions;
}
