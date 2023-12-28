import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { DemoConnector } from '../connector/demo.connector';

@Injectable()
export class CommonService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private altafidConnector: DemoConnector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: Logger,
  ) {}
}
