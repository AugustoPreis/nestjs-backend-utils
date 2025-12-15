import * as bcrypt from 'bcrypt';

/**
 * Helper para operações com senhas utilizando bcrypt
 *
 * Fornece métodos síncronos e assíncronos para hash e comparação de senhas,
 * utilizando o algoritmo bcrypt com configuração de salt rounds.
 */
export class PasswordHelper {
  /**
   * Número padrão de salt rounds para hash
   */
  private static defaultSaltRounds: number = 10;

  /**
   * Define o número padrão de salt rounds
   */
  public static setSaltRounds(rounds: number): void {
    this.defaultSaltRounds = rounds;
  }

  /**
   * Gera o salt de forma síncrona
   */
  public static saltSync(rounds?: number): string {
    return bcrypt.genSaltSync(rounds || this.defaultSaltRounds);
  }

  /**
   * Cria hash de senha de forma síncrona
   */
  public static hashSync(password: string, saltRounds?: number): string {
    return bcrypt.hashSync(password, saltRounds || this.defaultSaltRounds);
  }

  /**
   * Compara senha com hash de forma síncrona
   */
  public static compareSync(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  /**
   * Cria hash de senha de forma assíncrona
   */
  public static async hash(
    password: string,
    saltRounds?: number,
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds || this.defaultSaltRounds);
  }

  /**
   * Compara senha com hash de forma assíncrona
   */
  public static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
