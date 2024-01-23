import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DemoConnector } from '../connector/demo.connector';
import { HelloworldDTO } from '../dto/helloworld.dto';
import { GenericException } from '../exception/generic.exception';
import { HelloworldErrorcode } from '../errorcode/helloworld.errorcode';
import { Policy } from 'cockatiel';
import { createAxiosBreaker } from '../tool/circuit-breaker';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class HelloworldService {
  constructor(
    private logger: Logger,
    private cls: ClsService,
    private demoConnector: DemoConnector,
  ) {}

  hellworlds: HelloworldDTO[] = [
    {
      name: 'abc',
      age: 12,
    },
  ];

  findAll() {
    /*throw new GenericException(
      HelloworldErrorcode.AGE_TOO_ERROR.msg,
      HttpStatus.INTERNAL_SERVER_ERROR,
      HelloworldErrorcode.AGE_TOO_ERROR.code,
    );*/
    this.logger.log(`tenant is ${this.cls.get('123')}`, HelloworldService.name);
    return this.hellworlds;
  }

  create(helloworldDTO: HelloworldDTO) {
    this.logger.log(`tenant is ${this.cls.get('TENANT_ID')}`, HelloworldService.name);
    if (helloworldDTO.age < 10) {
      throw new GenericException(
        HelloworldErrorcode.AGE_TOO_ERROR.msg,
        HttpStatus.BAD_REQUEST,
        HelloworldErrorcode.AGE_TOO_ERROR.code,
      );
    }
    this.hellworlds.push(helloworldDTO);
    return helloworldDTO;
  }

  /*@Policy.use(createAxiosBreaker('Oro'))
  async findOne(name: string) {
    const result = await this.demoConnector.doGet({
      url: 'http://localhost:4000/v1/helloworld/',
      method: 'GET',
    });
    return result?.data?.find((r) => r.name === name);
  }*/

  async findOne(name: string) {
    const result = await this.demoConnector.doGet({
      url: 'http://localhost:4000/v1/helloworld/',
      method: 'GET',
    });
    return result?.data?.find((r) => r.name === name);
  }
}
