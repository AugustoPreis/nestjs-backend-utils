/**
 * Options for StringToJson
 */
export interface StringToJsonOptions {
  fallback?: unknown;
  reviver?: (key: string, value: unknown) => unknown;
}
