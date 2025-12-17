import { ArrayHelper } from '@helpers';

/**
 * Helper para manipulação de objetos
 *
 */
export class ObjectHelper {
  /**
   * Clone profundo de objeto
   */
  public static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge profundo de objetos
   */
  public static deepMerge<T>(...objects: Partial<T>[]): Partial<T> {
    return objects.reduce((acc, obj) => {
      Object.keys(obj).forEach((key) => {
        const itemKey = key as keyof T;

        const accValue = acc[itemKey];
        const objValue = obj[itemKey];

        if (this.isObject(accValue) && this.isObject(objValue)) {
          acc[itemKey] = this.deepMerge(accValue, objValue) as T[keyof T];
        } else {
          acc[itemKey] = objValue;
        }
      });
      return acc;
    }, {} as T);
  }

  /**
   * Seleciona apenas keys especificadas
   */
  public static pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;

    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });

    return result;
  }

  /**
   * Exclui keys especificadas
   */
  public static omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };

    keys.forEach((key) => {
      delete result[key];
    });

    return result;
  }

  /**
   * Verifica se objeto está vazio
   */
  public static isEmpty(obj: unknown): boolean {
    if (!obj) return true;

    if (Array.isArray(obj)) return ArrayHelper.isEmpty(obj);

    if (this.isObject(obj)) return Object.keys(obj).length === 0;

    return false;
  }

  /**
   * Comparação profunda de objetos
   */
  public static isEqual(obj1: object, obj2: object): boolean {
    if (!this.isObject(obj1) || !this.isObject(obj2)) return false;

    const object1Keys = Object.keys(obj1);
    const object2Keys = Object.keys(obj2);

    if (object1Keys.length !== object2Keys.length) return false;

    for (const key of object1Keys) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      const areObjects = this.isObject(val1) && this.isObject(val2);

      const isValid = areObjects ? this.isEqual(val1, val2) : val1 === val2;
      if (!isValid) return false;
    }

    return true;
  }

  /**
   * Achata objeto aninhado
   */
  public static flattenObject(
    obj: object,
    separator: string = '.',
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    const flatten = (current: unknown, prefix: string = ''): void => {
      if (!this.isObject(current) || Array.isArray(current)) {
        result[prefix] = current;
        return;
      }

      Object.entries(current).forEach(([key, value]) => {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;

        flatten(value, newKey);
      });
    };

    flatten(obj);

    return result;
  }

  /**
   * Desachata objeto
   */
  public static unflattenObject(
    obj: Record<string, unknown>,
    separator: string = '.',
  ): object {
    const result: Record<string, unknown> = {};

    Object.entries(obj).forEach(([key, value]) => {
      const keys = key.split(separator);
      let current = result;

      keys.forEach((k, i) => {
        const isLast = i === keys.length - 1;

        if (isLast) {
          current[k] = value;
        } else {
          current[k] = current[k] || {};
          current = current[k] as Record<string, unknown>;
        }
      });
    });

    return result;
  }

  /**
   * Verifica se é um objeto simples
   */
  public static isObject(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }
}
