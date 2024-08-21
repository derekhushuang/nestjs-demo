import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService, private logger: Logger) {}

  @Post('session-create')
  async handlePaymentSessionCreate(@Body() body: any) {
    const { id, amount, customer_id } = body;
    return await this.paymentService.createPaymentSession(id, amount, customer_id);
  }

  @Post('session-resolve')
  async handlePaymentSessionResolve(@Body() body: any) {
    const { id, sale_id } = body;
    return await this.paymentService.resolvePaymentSession(id, sale_id);
  }

  @Post('session-refund')
  async handlePaymentSessionRefund(@Body() body: any) {
    const { id, sale_id, amount } = body;
    return await this.paymentService.refundPaymentSession(id, amount, sale_id);
  }
}
