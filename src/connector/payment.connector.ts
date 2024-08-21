import { Injectable, Logger } from '@nestjs/common';
import { BaseConnector, MethodType } from './base.connector';
import type { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { maskRequestData } from '../tool/common.tool';
import { ClsService } from 'nestjs-cls';
import { config } from '../config';

@Injectable()
export class PaymentConnector extends BaseConnector {
  constructor(
    private cls: ClsService,
    private readonly httpService: HttpService,
    private logger: Logger,
  ) {
    super();
  }

  async doGet(axiosRequestConfig: AxiosRequestConfig): Promise<any> {
    const authorizationConfig = {
      ...axiosRequestConfig,
      method: MethodType.GET,
      headers: {
        Authorization: `Bearer ${config.get('application.payment.API_KEY')}`,
        ...axiosRequestConfig.headers,
        ...this.traceIdHeader(),
      },
    } as any;

    this.logger.log(
      `request url: ${authorizationConfig.method} ${authorizationConfig.url}`,
      PaymentConnector.name,
    );
    if (authorizationConfig.data) {
      this.logger.debug(
        `request data: ${maskRequestData(authorizationConfig.data)}`,
        PaymentConnector.name,
      );
    }
    const result = await lastValueFrom(this.httpService.request(authorizationConfig));
    this.logger.log(`response status: ${result?.status}`, PaymentConnector.name);
    return result;
  }

  async doPost(axiosRequestConfig: AxiosRequestConfig): Promise<any> {
    const authorizationConfig = {
      ...axiosRequestConfig,
      method: MethodType.POST,
      headers: {
        Authorization: `Bearer ${config.get('application.payment.API_KEY')}`,
        ...axiosRequestConfig.headers,
        ...this.traceIdHeader(),
      },
    } as any;

    this.logger.log(
      `request url: ${authorizationConfig.method} ${authorizationConfig.url}`,
      PaymentConnector.name,
    );
    if (authorizationConfig.data) {
      this.logger.debug(
        `request data: ${maskRequestData(authorizationConfig.data)}`,
        PaymentConnector.name,
      );
    }

    const result = await lastValueFrom(this.httpService.request(authorizationConfig));

    this.logger.log(`response status: ${result?.status}`, PaymentConnector.name);
    return result;
  }
}
