import {
  ControllerInjector,
  EventEmitterInjector,
  GuardInjector,
  LoggerInjector,
  PipeInjector,
  ScheduleInjector,
} from '@metinseylan/nestjs-opentelemetry';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OpenTelemetryModuleConfig } from '@metinseylan/nestjs-opentelemetry/dist/OpenTelemetryModuleConfig';
import { config } from './config';
import { CacheModuleAsyncOptions } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';

export const getOpenTelemetryConfig = (): Partial<OpenTelemetryModuleConfig> => {
  const enableTracing = config.get('application.enableTracing');
  const options = {
    url: config.get('application.zipkinURL'),
    headers: { 'x-b3-sampled': '1' },
  };

  return enableTracing
    ? ({
        traceAutoInjectors: [
          ControllerInjector,
          GuardInjector,
          EventEmitterInjector,
          ScheduleInjector,
          PipeInjector,
          LoggerInjector,
        ],
        spanProcessor: new SimpleSpanProcessor(new TraceExporter()),
      } as any)
    : {};
};

export const getCacheConfig = () => {
  return {
    isGlobal: true,
    useFactory: async () => {
      if (!config.get('application.enableRedisCache')) {
        return {
          store: 'memory',
        };
      }

      const store = await redisStore({
        socket: {
          host: config.get('application.redis.host'),
          port: config.get('application.redis.port'),
          connectTimeout: config.get('application.redis.connectTimeout'),
        },
        database: config.get('application.redis.database'),
      });
      return {
        store: store,
      };
    },
  } as CacheModuleAsyncOptions;
};
