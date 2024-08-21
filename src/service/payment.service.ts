import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { PaymentConnector } from '../connector/payment.connector';
import { config } from '../config';

@Injectable()
export class PaymentService {
  constructor(
    private logger: Logger,
    private cls: ClsService,
    private paymentConnector: PaymentConnector,
  ) {}

  async createPaymentSession(id, amount, customer_id) {
    try {
      // 调用 /detail 接口查询账户和余额
      const detailResponse = await this.paymentConnector.doPost({
        url: `${config.get('application.payment.API_BASE_URL')}/detail`,
        data: {
          customer_id: customer_id,
        },
      });

      const balance = detailResponse.data.balance;

      if (balance >= amount) {
        // 调用 /sale 接口进行扣款
        const saleResponse = await this.paymentConnector.doPost({
          url: `${config.get('application.payment.API_BASE_URL')}/sale`,
          data: {
            customer_id: customer_id,
            amount: amount,
          },
        });

        // 返回 payment session resolve 响应
        return {
          id: id,
          status: 'completed',
          sale_id: saleResponse.data.sale_id,
        };
      } else {
        // 如果余额不足，返回失败状态
        throw new HttpException(
          {
            id: id,
            status: 'failed',
            message: 'Insufficient balance',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing payment session create: ${error.message}`,
        error.stack,
        PaymentService.name,
      );
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resolvePaymentSession(id, sale_id) {
    try {
      // 返回支付会话已解决的响应
      return {
        id: id,
        status: 'resolved',
        sale_id: sale_id,
      };
    } catch (error) {
      this.logger.error(
        `Error processing payment session resolve: ${error.message}`,
        error.stack,
        PaymentService.name,
      );
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refundPaymentSession(id, amount, sale_id) {
    try {
      // 调用 /return 接口进行退款
      const returnResponse = await this.paymentConnector.doPost({
        url: `${config.get('application.payment.API_BASE_URL')}/return`,
        data: {
          sale_id: sale_id,
          amount: amount,
        },
      });

      return {
        id: id,
        status: 'refunded',
        return_id: returnResponse.data.return_id,
      };
    } catch (error) {
      this.logger.error(
        `Error processing payment session refund: ${error.message}`,
        error.stack,
        PaymentService.name,
      );
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
