/**
 * Helper para manipulação de arrays
 */
export class ArrayHelper {
  /**
   * Verifica se array está vazio
   */
  public static isEmpty(arr: unknown[]): boolean {
    return arr.length === 0;
  }

  /**
   * Remove duplicatas do array
   */
  public static unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  /**
   * Agrupa array por chave
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
   * Divide array em chunks
   */
  public static chunk<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }

    return chunks;
  }

  /**
   * Embaralha array
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
   * Diferença entre arrays
   */
  public static difference<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((item) => !arr2.includes(item));
  }

  /**
   * Interseção de arrays
   */
  public static intersection<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((item) => arr2.includes(item));
  }

  /**
   * União de arrays
   */
  public static union<T>(...arrays: T[][]): T[] {
    return this.unique(arrays.flat());
  }

  /**
   * Remove null/undefined do array
   */
  public static compact<T>(arr: (T | null | undefined)[]): T[] {
    return arr.filter((item) => item != null);
  }
}
