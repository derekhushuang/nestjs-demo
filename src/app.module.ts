import { CacheModule, Module, UnauthorizedException } from '@nestjs/common';
import { GlobalModule } from './global.module';
import { getCacheConfig, getOpenTelemetryConfig } from './module.config';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { RedisClientOptions } from 'redis';
import { HelloworldModule } from './module/helloworld.module';
import { ClsModule } from 'nestjs-cls';
import * as jwt from 'jsonwebtoken';

@Module({
  imports: [
    GlobalModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req: Request, res: Response) => {
          const { authorization }: any = req.headers;
          const token = authorization?.replace('Bearer ', '');
          if (token) {
            const payload = jwt.decode(token);
            cls.set('req', req);
            cls.set('TENANT_ID', payload['https://aaxis.io/app-tenantId']);
          }
        },
      },
    }),
    CacheModule.registerAsync<RedisClientOptions>(getCacheConfig()),
    OpenTelemetryModule.forRoot(getOpenTelemetryConfig()),
    HelloworldModule,
  ],
})
export class AppModule {}
