/**
 * Interface para a estrutura de resposta de erro padronizada
 */
export interface IExceptionResponse {
  /**
   * Mensagem principal do erro
   */
  message: string;

  /**
   * Array com todos os erros detalhados
   */
  errors: string[];

  /**
   * Status HTTP do erro
   */
  statusCode?: number;

  /**
   * UUID para rastreamento de erros internos (opcional)
   */
  uuid?: string;
}
