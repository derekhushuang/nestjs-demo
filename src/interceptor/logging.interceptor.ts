import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { maskedJsonStringify } from '../tool/common.tool';
import { ClsService } from 'nestjs-cls';
import { DemoConnector } from '../connector/demo.connector';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private cls: ClsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.cls.set('123', 'test');
    const reqd = this.cls.get('req');
    if (context.getType().toString() === 'graphql') {
      Logger.log(
        `${context.getClass().name}.${context.getHandler().name}()`,
        LoggingInterceptor.name,
      );
      Logger.debug(
        `${context.getHandler().name} request variables: ${maskedJsonStringify(
          context.getArgByIndex(3)?.variableValues ?? '',
        )}`,
        LoggingInterceptor.name,
      );
      return next.handle();
    }
    const req: Request = context.switchToHttp().getRequest();
    Logger.log(
      `${context.getClass().name}.${context.getHandler().name}() : ${req.method} ${req.url}`,
      LoggingInterceptor.name,
    );
    return next.handle();
  }
}
