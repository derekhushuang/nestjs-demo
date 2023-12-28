import { HttpException } from '@nestjs/common';

export class GenericException extends HttpException {
  constructor(
    response: string | Record<string, any>,
    status: number,
    private readonly code: string,
  ) {
    super(response, status);
  }

  getCode() {
    return this.code;
  }
}
