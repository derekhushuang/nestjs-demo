/* eslint-disable dot-notation */
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpServer,
  HttpStatus,
  Inject,
  Logger,
  Optional,
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';
import { context, trace } from '@opentelemetry/api';
import { GenericException } from '../exception/generic.exception';

export class BaseExceptionFilter<T = any> implements ExceptionFilter<T> {
  private static readonly logger = new Logger('ExceptionsHandler');

  @Optional()
  @Inject()
  protected readonly httpAdapterHost?: HttpAdapterHost;

  constructor(protected readonly applicationRef?: HttpServer) {}

  catch(exception: T, host: ArgumentsHost): void {
    const applicationRef =
      this.applicationRef || (this.httpAdapterHost && this.httpAdapterHost.httpAdapter);

    const traceId = trace.getSpan(context.active())?.spanContext()?.traceId;

    if (!(exception instanceof HttpException || exception instanceof GenericException)) {
      return this.handleUnknownError(exception, host, applicationRef);
    }

    const res = exception.getResponse();
    const getErrorMessage = (msg) => (msg === 'Generic Exception' ? res : msg);
    const message = {
      code: exception['code'] || exception.getStatus(),
      message:
        exception instanceof GenericException
          ? getErrorMessage(exception.message)
          : (res && res['message']) || exception.message,
      status: exception.getStatus(),
      traceId,
    };

    BaseExceptionFilter.logger.error(message, exception.stack);

    const response = host.getArgByIndex(1);
    if (!applicationRef.isHeadersSent(response)) {
      applicationRef.reply(response, { errors: [message] }, exception.getStatus());
    } else {
      applicationRef.end(response);
    }
  }

  public handleUnknownError(
    exception: T,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ): void {
    const traceId = trace.getSpan(context.active())?.spanContext()?.traceId;
    const message = {
      code: 'UnknownError',
      message: exception['message'] || MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
      status: exception['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR,
      traceId,
    };
    applicationRef.reply(host.getArgByIndex(1), { errors: [message] }, message.status);
    if (this.isExceptionObject(exception)) {
      return BaseExceptionFilter.logger.error(exception.message, exception.stack);
    }
    return BaseExceptionFilter.logger.error(exception);
  }

  public isExceptionObject(err: any): err is Error {
    return isObject(err) && !!(err as Error).message;
  }

  public isExceptionResObject(res: any) {
    return res && isObject(res) && !!res['message'];
  }

  /**
   * Checks if the thrown error comes from the "http-errors" library.
   * @param err error object
   */
  public isHttpError(err: any): err is { statusCode: number; message: string } {
    return err?.statusCode && err?.message;
  }
}
