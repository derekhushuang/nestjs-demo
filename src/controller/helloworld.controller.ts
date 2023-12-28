import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { HelloworldService } from '../service/helloworld.service';
import { HelloworldDTO } from '../dto/helloworld.dto';
import { LoggingInterceptor, TraceIdInterceptor } from '../interceptor';

@Controller({
  path: '/helloworld',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class HelloworldController {
  constructor(private helloworldService: HelloworldService) {}

  @Get('/')
  @HttpCode(200)
  helloworld() {
    return this.helloworldService.getHelloworld();
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() helloworldDTO: HelloworldDTO): Promise<HelloworldDTO> {
    const created = this.helloworldService.create(helloworldDTO);
    return created;
  }
}
