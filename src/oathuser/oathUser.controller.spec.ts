import { Test, TestingModule } from '@nestjs/testing';
import { OathUserController } from './oathUser.controller';

describe('OathuserController', () => {
  let controller: OathUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OathUserController],
    }).compile();

    controller = module.get<OathUserController>(OathUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
