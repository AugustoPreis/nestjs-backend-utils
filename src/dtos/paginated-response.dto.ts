/**
 * DTO for paginated response
 *
 * Standardized structure for endpoint responses that return
 * paginated data.
 */
export class PaginatedResponseDTO<T> {
  /**
   * Data array
   */
  public data: T[];

  /**
   * Total records
   */
  public total: number;

  /**
   * Current page
   */
  public page?: number;

  /**
   * Total pages
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
