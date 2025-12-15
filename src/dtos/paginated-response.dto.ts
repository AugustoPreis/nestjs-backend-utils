/**
 * DTO para resposta paginada
 *
 * Estrutura padronizada para respostas de endpoints que retornam
 * dados paginados.
 */
export class PaginatedResponseDTO<T> {
  /**
   * Array de dados
   */
  public data: T[];

  /**
   * Total de registros
   */
  public total: number;

  /**
   * Página atual
   */
  public page?: number;

  /**
   * Total de páginas
   */
  public pages?: number;

  public constructor(
    data: T[],
    total: number,
    page?: number,
    pageSize?: number,
  ) {
    this.data = data;
    this.total = total;
    this.page = page;

    if (page && pageSize) {
      this.pages = Math.ceil(total / pageSize);
    }
  }
}
