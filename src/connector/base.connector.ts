import { context, trace } from '@opentelemetry/api';
import { getAuthorization } from '../tool/common.tool';

export enum MethodType {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
}

export class BaseConnector {
  authorizationHeader(request) {
    const authorization = getAuthorization(request);
    return {
      Authorization: authorization,
    };
  }

  traceIdHeader() {
    const currentSpan = trace.getSpan(context.active());
    const traceId = currentSpan?.spanContext()?.traceId;
    const spanId = currentSpan?.spanContext()?.spanId;
    const traceFlags = currentSpan?.spanContext()?.traceFlags;
    return {
      'x-cloud-trace-context': `${traceId}/${spanId};o=1`,
      'x-b3-spanid': spanId,
      'x-b3-traceid': traceId,
      'x-b3-sampled': 1,
    };
  }
}
