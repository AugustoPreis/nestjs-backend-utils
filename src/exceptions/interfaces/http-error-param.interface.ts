export interface IHttpErrorParam {
  /**
   * Mensagem ou array de mensagens de erro
   */
  message: string | string[];

  /**
   * Mensagem de erro adicional (opcional)
   */
  error?: string;
}
