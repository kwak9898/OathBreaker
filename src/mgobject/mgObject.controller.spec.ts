import { Test, TestingModule } from '@nestjs/testing';
import { MgObjectController } from './mgObject.controller';

describe('MgObjectController', () => {
  let controller: MgObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MgObjectController],
    }).compile();

    controller = module.get<MgObjectController>(MgObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
