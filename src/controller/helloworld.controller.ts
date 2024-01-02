import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HelloworldService } from '../service/helloworld.service';
import { HelloworldDTO } from '../dto/helloworld.dto';
import { AuthGuard, LoggingInterceptor, TraceIdInterceptor } from '../interceptor';
import { ApiScopes } from '../tool/common.tool';

@Controller({
  path: '/helloworld',
  version: '1',
})
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class HelloworldController {
  constructor(private helloworldService: HelloworldService) {}

  @Get('/')
  @HttpCode(200)
  findAll() {
    return this.helloworldService.findAll();
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiScopes('test1', 'test2')
  create(@Body() helloworldDTO: HelloworldDTO): HelloworldDTO {
    const created = this.helloworldService.create(helloworldDTO);
    return created;
  }
}
