import { Module } from '@nestjs/common';
import { PaymentController } from '../controller/payment.controller';
import { PaymentService } from '../service/payment.service';
import { PaymentConnector } from '../connector/payment.connector';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PaymentConnector, PaymentService],
  controllers: [PaymentController],
  exports: [PaymentConnector, PaymentService],
})
export class PaymentModule {}
