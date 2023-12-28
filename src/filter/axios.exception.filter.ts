import { ArgumentsHost, Catch, HttpServer, HttpStatus, LoggerService } from '@nestjs/common';
import axios from 'axios';
import { GenericException } from '../exception/generic.exception';
import { BaseExceptionFilter } from './base.exception.filter';
import { CommonErrorCode } from '../errorcode/common.errorcode';

@Catch()
export class AxiosExceptionFilter extends BaseExceptionFilter {
  constructor(protected logger: LoggerService, protected readonly applicationRef?: HttpServer) {
    super();
  }

  catch(exception: Error, host: ArgumentsHost): void {
    if (host.getType().toString() === 'graphql') return;
    if (axios.isAxiosError(exception)) {
      const axiosException = exception;
      if (axiosException.response) {
        const responseData = axiosException.response.data;
        exception = new GenericException(
          responseData.message ? responseData.message : responseData,
          axiosException.response.status,
          responseData.code ? responseData.code : CommonErrorCode.AXIOS_ERROR.code,
        );
      } else {
        exception = new GenericException(
          `${CommonErrorCode.UNEXPECTED_AXIOS_ERROR.msg} ${axiosException}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          CommonErrorCode.UNEXPECTED_AXIOS_ERROR.code,
        );
      }
    }
    // eslint-disable-next-line dot-notation
    if (exception['isBrokenCircuitError']) {
      exception = new GenericException(
        CommonErrorCode.CIRCUIT_BREAKER_ERROR.msg,
        HttpStatus.SERVICE_UNAVAILABLE,
        CommonErrorCode.CIRCUIT_BREAKER_ERROR.code,
      );
    }
    super.catch(exception, host);
  }
}
