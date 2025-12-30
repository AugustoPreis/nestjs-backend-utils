export enum EValidationErrorMessages {
  ARRAY = 'The field "{field}" must be an array.',
  MIN_ELEMENTS = 'The field "{field}" must have at least {min} elements',
  MAX_ELEMENTS = 'The field "{field}" must have at most {max} elements',

  BOOLEAN = 'The field "{field}" must be true or false.',

  DATE = 'The field "{field}" must be a valid date.',

  EMAIL = 'The field "{field}" must be a valid email.',

  UUID = 'The field "{field}" must be a valid UUID.',

  URL = 'The field "{field}" must be a valid URL.',

  OBJECT = 'The field "{field}" must be an object.',

  JSON = 'The field "{field}" must be a valid JSON.',

  ENUM = 'The field "{field}" must be one of the following values: {values}.',

  NUMBER = 'The field "{field}" must be a number.',
  INTEGER = 'The field "{field}" must be an integer.',
  MIN = 'The field "{field}" must be greater than or equal to {min}.',
  MAX = 'The field "{field}" must be less than or equal to {max}.',
  POSITIVE_NUMBER = 'The field "{field}" must be a positive number.',
  NEGATIVE_NUMBER = 'The field "{field}" must be a negative number.',

  STRING = 'The field "{field}" must be a string.',
  MIN_LENGTH = 'The field "{field}" must have at least {minLength} characters.',
  MAX_LENGTH = 'The field "{field}" must have at most {maxLength} characters.',
  PATTERN = 'The field "{field}" has an invalid format.',
}
