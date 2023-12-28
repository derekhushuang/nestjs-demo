import { CacheModule, Module } from '@nestjs/common';
import { GlobalModule } from './global.module';
import { getCacheConfig, getOpenTelemetryConfig } from './module.config';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { RedisClientOptions } from 'redis';
import { HelloworldModule } from './module/helloworld.module';

@Module({
  imports: [
    GlobalModule,
    CacheModule.registerAsync<RedisClientOptions>(getCacheConfig()),
    OpenTelemetryModule.forRoot(getOpenTelemetryConfig()),
    HelloworldModule,
  ],
})
export class AppModule {}
