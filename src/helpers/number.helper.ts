/**
 * Helper para manipulação de números

*/
export class NumberHelper {
  /**
   * Verifica se valor é numérico
   */
  public static isNumeric(value: unknown): boolean {
    return !isNaN(Number(value)) && isFinite(Number(value));
  }

  /**
   * Converte para número com fallback
   */
  public static toNumber(value: unknown, fallback: number = 0): number {
    const num = Number(value);

    return isNaN(num) ? fallback : num;
  }

  /**
   * Arredonda número
   */
  public static round(num: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);

    return Math.round(num * factor) / factor;
  }

  /**
   * Limita número ao range
   */
  public static clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  /**
   * Número aleatório no range
   */
  public static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calcula porcentagem
   */
  public static percentage(value: number, total: number): number {
    if (total === 0) return 0;

    return (value / total) * 100;
  }

  /**
   * Formata moeda
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
