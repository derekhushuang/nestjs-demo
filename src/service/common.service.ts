import {Inject, Injectable, Logger} from '@nestjs/common';
import {REQUEST} from '@nestjs/core';
import {Request} from 'express';
import {DemoConnector} from '../connector/demo.connector';

@Injectable()
export class CommonService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private demoConnector: DemoConnector,
    private logger: Logger,
  ) {}
}
