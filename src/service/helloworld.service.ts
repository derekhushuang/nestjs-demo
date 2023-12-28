import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DemoConnector } from '../connector/demo.connector';
import { SuccessResponse } from '../dto/success.response';
import { HelloworldDTO } from '../dto/helloworld.dto';
import { GenericException } from '../exception/generic.exception';
import { HelloworldErrorcode } from '../errorcode/helloworld.errorcode';

@Injectable()
export class HelloworldService {
  constructor(private altafidConnector: DemoConnector, private logger: Logger) {}

  private hellworld = null;

  getHelloworld() {
    return new SuccessResponse('200', 'hello world', true);
  }

  create(helloworldDTO: HelloworldDTO) {
    if (helloworldDTO.age < 10) {
      throw new GenericException(
        HelloworldErrorcode.AGE_TOO_ERROR.msg,
        HttpStatus.BAD_REQUEST,
        HelloworldErrorcode.AGE_TOO_ERROR.code,
      );
    }
    this.hellworld = helloworldDTO;
    return this.hellworld;
  }
}
