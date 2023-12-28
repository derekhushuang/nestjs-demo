export class SuccessResponse {
  constructor(code: string, message: string, success = true) {
    this.code = code;
    this.message = message;
    this.success = success;
  }

  private code: string;
  private message: string;
  private success = true;
}
