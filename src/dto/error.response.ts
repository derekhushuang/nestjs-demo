export class ErrorResponse {
  constructor(code: string, message: string, success = false) {
    this.code = code;
    this.message = message;
    this.success = success;
  }

  private code: string;
  private message: string;
  private success = false;
}
