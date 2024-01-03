import { Test } from '@nestjs/testing';
import { HelloworldController } from '../../controller/helloworld.controller';
import { HelloworldService } from '../../service/helloworld.service';
import { GlobalModule } from '../../global.module';

describe('HelloworldController', () => {
  let helloworldController: HelloworldController;
  let helloworldService: HelloworldService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GlobalModule],
      controllers: [HelloworldController],
      providers: [HelloworldService],
    }).compile();

    helloworldService = await moduleRef.resolve(HelloworldService);
    helloworldController = await moduleRef.resolve(HelloworldController);
  });

  describe('findAll', () => {
    it('should return an array of hellworld', () => {
      const result = [
        {
          name: 'abc',
          age: 12,
        },
      ];
      jest.spyOn(helloworldService, 'findAll').mockImplementation(() => result);

      expect(helloworldController.findAll()).toEqual(result);
    });
  });

  describe('create', () => {
    it('should return the created hellworld object', () => {
      const helloworld = {
        name: 'test',
        age: 15,
      };
      jest.spyOn(helloworldService, 'create').mockImplementation((helloworld) => helloworld);

      expect(helloworldController.create(helloworld)).toEqual(helloworld);
    });
  });
});
