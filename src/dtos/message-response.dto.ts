/**
 * DTO para respostas simples com mensagem
 *
 * Estrutura padronizada para respostas que retornam apenas
 * uma mensagem de sucesso ou confirmação.
 */
export class MessageResponseDTO {
  /**
   * Mensagem de resposta
   */
  public message: string;

  /**
   * Indica sucesso da operação
   */
  public success?: boolean;

  public constructor(message: string, success: boolean = true) {
    this.message = message;
    this.success = success;
  }
}
