import { Module } from '@nestjs/common';
import { HelloworldController } from '../controller/helloworld.controller';
import { HelloworldService } from '../service/helloworld.service';

@Module({
  providers: [HelloworldService],
  controllers: [HelloworldController],
  exports: [HelloworldService],
})
export class HelloworldModule {}
