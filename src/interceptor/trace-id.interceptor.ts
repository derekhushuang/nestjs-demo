import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { tap } from 'rxjs/operators';
import { trace, context } from '@opentelemetry/api';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<any> {
    if (executionContext.getType().toString() === 'graphql') {
      return next.handle();
    }
    const res: Response = executionContext.switchToHttp().getResponse();
    const currentSpan = trace.getSpan(context.active());
    const traceId = currentSpan?.spanContext()?.traceId;
    return next.handle().pipe(
      tap(() => {
        if (!res.headersSent) {
          res.setHeader('x-b3-traceid', traceId);
        }
      }),
    );
  }
}
