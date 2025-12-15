/**
 * Opções do transformer StringToJson
 */
export interface StringToJsonOptions {
  fallback?: unknown;
  reviver?: (key: string, value: unknown) => unknown;
}
