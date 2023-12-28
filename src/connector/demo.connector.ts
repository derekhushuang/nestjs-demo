import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseConnector, MethodType } from './base.connector';
import type { AxiosRequestConfig } from 'axios';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { maskRequestData } from '../tool/common.tool';

@Injectable()
export class DemoConnector extends BaseConnector {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly httpService: HttpService,
    private logger: Logger,
  ) {
    super();
  }

  async doGet(config: AxiosRequestConfig): Promise<any> {
    const authorizationConfig = {
      ...config,
      method: MethodType.GET,
      headers: {
        ...config.headers,
        ...this.authorizationHeader(this.request),
        ...this.traceIdHeader(),
      },
    } as any;

    this.logger.log(
      `request url: ${authorizationConfig.method} ${authorizationConfig.url}`,
      DemoConnector.name,
    );
    if (authorizationConfig.data) {
      this.logger.debug(
        `request data: ${maskRequestData(authorizationConfig.data)}`,
        DemoConnector.name,
      );
    }
    const result = await lastValueFrom(this.httpService.request(authorizationConfig));
    this.logger.log(`response status: ${result?.status}`, DemoConnector.name);
    return result;
  }

  async doPost(config: AxiosRequestConfig): Promise<any> {
    const authorizationConfig = {
      ...config,
      method: MethodType.POST,
      headers: {
        ...config.headers,
        ...this.authorizationHeader(this.request),
        ...this.traceIdHeader(),
      },
    } as any;

    this.logger.log(
      `request url: ${authorizationConfig.method} ${authorizationConfig.url}`,
      DemoConnector.name,
    );
    if (authorizationConfig.data) {
      this.logger.debug(
        `request data: ${maskRequestData(authorizationConfig.data)}`,
        DemoConnector.name,
      );
    }

    const result = await lastValueFrom(this.httpService.request(authorizationConfig));

    this.logger.log(`response status: ${result?.status}`, DemoConnector.name);
    return result;
  }
}
