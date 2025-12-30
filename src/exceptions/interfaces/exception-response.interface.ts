/**
 * Padronized interface for exception responses
 */
export interface IExceptionResponse {
  /**
   * Error message
   */
  message: string;

  /**
   * Detailed errors array
   */
  errors: string[];

  /**
   * HTTP status code (optional)
   */
  statusCode?: number;

  /**
   * UUID for internal error tracking (optional)
   */
  uuid?: string;
}
