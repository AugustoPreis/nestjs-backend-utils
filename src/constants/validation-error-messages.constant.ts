export enum EValidationErrorMessages {
  ARRAY = 'O campo "{field}" deve ser uma lista.',
  MIN_ELEMENTS = 'O campo "{field}" deve ter no mínimo {min} elementos',
  MAX_ELEMENTS = 'O campo "{field}" deve ter no máximo {max} elementos',

  BOOLEAN = 'O campo "{field}" deve ser verdadeiro ou falso.',

  DATE = 'O campo "{field}" deve ser uma data válida.',

  EMAIL = 'O campo "{field}" deve ser um e-mail válido.',

  UUID = 'O campo "{field}" deve ser um UUID válido.',

  URL = 'O campo "{field}" deve ser uma URL válida.',

  OBJECT = 'O campo "{field}" deve ser um objeto.',

  JSON = 'O campo "{field}" deve ser um JSON válido.',

  ENUM = 'O campo "{field}" deve ser um dos seguintes valores: {values}.',

  NUMBER = 'O campo "{field}" deve ser um número.',
  INTEGER = 'O campo "{field}" deve ser um número inteiro.',
  MIN = 'O campo "{field}" deve ser maior ou igual a {min}.',
  MAX = 'O campo "{field}" deve ser menor ou igual a {max}.',
  POSITIVE_NUMBER = 'O campo "{field}" deve ser um número positivo.',
  NEGATIVE_NUMBER = 'O campo "{field}" deve ser um número negativo.',

  STRING = 'O campo "{field}" deve ser um texto.',
  MIN_LENGTH = 'O campo "{field}" deve ter no mínimo {minLength} caracteres.',
  MAX_LENGTH = 'O campo "{field}" deve ter no máximo {maxLength} caracteres.',
  PATTERN = 'O campo "{field}" está em formato inválido.',
}
