export interface IHttpErrorParam {
  /**
   * Error message or array of error messages
   */
  message: string | string[];

  /**
   * Additional error message (optional)
   */
  error?: string;
}
