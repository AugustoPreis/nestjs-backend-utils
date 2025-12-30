/**
 * Helper for string manipulation
 *
 * Provides utility methods for common string operations,
 * including case conversions, truncation, masking and generation.
 */
export class StringHelper {
  /**
   * Converts first letter to uppercase
   */
  public static capitalize(
    str: string,
    allWords: boolean = false,
    lowercaseRest: boolean = true,
  ): string {
    if (!str) return str;

    if (allWords) {
      return str
        .split(' ')
        .map((word) => this.capitalize(word, false, lowercaseRest))
        .join(' ');
    }

    const first = str.charAt(0).toUpperCase();
    const rest = lowercaseRest ? str.slice(1).toLowerCase() : str.slice(1);

    return first + rest;
  }

  /**
   * Converts string to camelCase
   */
  public static camelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  }

  /**
   * Converts string to snake_case
   */
  public static snakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[-\s]+/g, '_')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Converts string to kebab-case
   */
  public static kebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .replace(/[_\s]+/g, '-')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Truncates string adding suffix
   */
  public static truncate(
    str: string,
    length: number,
    suffix: string = '...',
  ): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Removes accents from string
   */
  public static removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Generates random string
   */
  public static randomString(length: number, charset?: string): string {
    const defaultCharset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const chars = charset || defaultCharset;
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Masks string leaving only some characters visible
   */
  public static mask(
    str: string,
    maskChar: string = '*',
    visibleChars: number = 4,
  ): string {
    if (str.length <= visibleChars) return str;

    const masked = maskChar.repeat(str.length - visibleChars);
    const visible = str.slice(-visibleChars);

    return masked + visible;
  }

  /**
   * Checks if string is empty (null, undefined or only spaces)
   */
  public static isEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Counts occurrences of substring in string
   */
  public static countOccurrences(
    str: string,
    search: string,
    caseSensitive: boolean = true,
  ): number {
    if (!search) return 0;

    const source = caseSensitive ? str : str.toLowerCase();
    const target = caseSensitive ? search : search.toLowerCase();

    const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return (source.match(new RegExp(escapedTarget, 'g')) || []).length;
  }
}
