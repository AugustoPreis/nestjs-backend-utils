/**
 * DTO for simple responses with message
 *
 * Standardized structure for responses that return only
 * a success or confirmation message.
 */
export class MessageResponseDTO {
  /**
   * Response message
   */
  public message: string;

  /**
   * Indicates operation success
   */
  public success?: boolean;

  public constructor(message: string, success: boolean = true) {
    this.message = message;
    this.success = success;
  }
}
