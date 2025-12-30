/**
 * Helper for number manipulation

*/
export class NumberHelper {
  /**
   * Checks if value is numeric
   */
  public static isNumeric(value: unknown): boolean {
    return !isNaN(Number(value)) && isFinite(Number(value));
  }

  /**
   * Converts to number with fallback
   */
  public static toNumber(value: unknown, fallback: number = 0): number {
    const num = Number(value);

    return isNaN(num) ? fallback : num;
  }

  /**
   * Rounds number
   */
  public static round(num: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);

    return Math.round(num * factor) / factor;
  }

  /**
   * Clamps number to range
   */
  public static clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  /**
   * Random number in range
   */
  public static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculates percentage
   */
  public static percentage(value: number, total: number): number {
    if (total === 0) return 0;

    return (value / total) * 100;
  }

  /**
   * Formats currency
   */
  public static formatCurrency(
    value: number,
    locale: string = 'pt-BR',
    currency: string = 'BRL',
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }
}
