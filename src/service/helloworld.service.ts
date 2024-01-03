import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DemoConnector } from '../connector/demo.connector';
import { HelloworldDTO } from '../dto/helloworld.dto';
import { GenericException } from '../exception/generic.exception';
import { HelloworldErrorcode } from '../errorcode/helloworld.errorcode';
import { Policy } from 'cockatiel';
import { createAxiosBreaker } from '../tool/circuit-breaker';

@Injectable()
export class HelloworldService {
  constructor(private demoConnector: DemoConnector, private logger: Logger) {}

  private hellworlds: HelloworldDTO[] = [
    {
      name: 'abc',
      age: 12,
    },
  ];

  findAll() {
    throw new GenericException(
      HelloworldErrorcode.AGE_TOO_ERROR.msg,
      HttpStatus.INTERNAL_SERVER_ERROR,
      HelloworldErrorcode.AGE_TOO_ERROR.code,
    );
    return this.hellworlds;
  }

  create(helloworldDTO: HelloworldDTO) {
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

  @Policy.use(createAxiosBreaker('Oro'))
  async findOne(name: string) {
    const result = await this.demoConnector.doGet({
      url: 'http://localhost:4000/v1/helloworld/',
      method: 'GET',
    });
    return result?.data?.find((r) => r.name === name);
  }
}
