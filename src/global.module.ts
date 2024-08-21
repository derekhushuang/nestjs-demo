import { Global, Logger, Module } from '@nestjs/common';
import { DemoConnector } from './connector/demo.connector';
import { HttpModule } from '@nestjs/axios';
import { CommonService } from './service/common.service';
import { PaymentConnector } from './connector/payment.connector';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [Logger, DemoConnector, CommonService],
  exports: [Logger, DemoConnector, CommonService],
})
export class GlobalModule {}
