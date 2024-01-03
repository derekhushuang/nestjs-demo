import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HelloworldService } from '../service/helloworld.service';
import { HelloworldDTO } from '../dto/helloworld.dto';
import { AuthGuard } from '../interceptor';
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

  @Get('/:name')
  @HttpCode(200)
  async findone(@Param('name') name: string) {
    return await this.helloworldService.findOne(name);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiScopes('test1', 'test2')
  create(@Body() helloworldDTO: HelloworldDTO): HelloworldDTO {
    const created = this.helloworldService.create(helloworldDTO);
    return created;
  }
}
