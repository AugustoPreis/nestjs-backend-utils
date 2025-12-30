import * as bcrypt from 'bcrypt';

/**
 * Helper for password operations using bcrypt
 *
 * Provides synchronous and asynchronous methods for hashing and comparing passwords,
 * using the bcrypt algorithm with salt rounds configuration.
 */
export class PasswordHelper {
  /**
   * Default number of salt rounds for hashing
   */
  private static defaultSaltRounds: number = 10;

  /**
   * Sets the default number of salt rounds
   */
  public static setSaltRounds(rounds: number): void {
    this.defaultSaltRounds = rounds;
  }

  /**
   * Generates salt synchronously
   */
  public static saltSync(rounds?: number): string {
    return bcrypt.genSaltSync(rounds || this.defaultSaltRounds);
  }

  /**
   * Creates password hash synchronously
   */
  public static hashSync(password: string, saltRounds?: number): string {
    return bcrypt.hashSync(password, saltRounds || this.defaultSaltRounds);
  }

  /**
   * Compares password with hash synchronously
   */
  public static compareSync(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  /**
   * Creates password hash asynchronously
   */
  public static async hash(
    password: string,
    saltRounds?: number,
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds || this.defaultSaltRounds);
  }

  /**
   * Compares password with hash asynchronously
   */
  public static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
