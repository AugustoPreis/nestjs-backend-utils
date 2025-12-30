/**
 * Helper for array manipulation
 */
export class ArrayHelper {
  /**
   * Checks if array is empty
   */
  public static isEmpty(arr: unknown): boolean {
    return !arr || !Array.isArray(arr) || arr.length === 0;
  }

  /**
   * Checks if it's an array and not empty
   */
  public static isNotEmpty<T>(arr: unknown): arr is T[] {
    return Array.isArray(arr) && arr.length > 0;
  }

  /**
   * Removes duplicates from array
   */
  public static unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  /**
   * Groups array by key
   */
  public static groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    const initialValue: Record<string, T[]> = {};

    return arr.reduce((acc, item) => {
      const groupKey = String(item[key]);

      if (!acc[groupKey]) acc[groupKey] = [];

      acc[groupKey].push(item);

      return acc;
    }, initialValue);
  }

  /**
   * Splits array into chunks
   */
  public static chunk<T>(arr: T[], size: number): T[][] {
    size = Math.max(1, size);

    const chunks: T[][] = [];

    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }

    return chunks;
  }

  /**
   * Shuffles array
   */
  public static shuffle<T>(arr: T[]): T[] {
    const shuffled = [...arr];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  /**
   * Difference between arrays
   */
  public static difference<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((item) => !arr2.includes(item));
  }

  /**
   * Intersection of arrays
   */
  public static intersection<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((item) => arr2.includes(item));
  }

  /**
   * Union of arrays
   */
  public static union<T>(...arrays: T[][]): T[] {
    return this.unique(arrays.flat());
  }

  /**
   * Removes null/undefined from array
   */
  public static compact<T>(arr: (T | null | undefined)[]): T[] {
    return arr.filter((item) => item != null);
  }
}
