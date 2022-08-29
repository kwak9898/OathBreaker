import { Test, TestingModule } from '@nestjs/testing';
import { MgimageController } from './mgimage.controller';

describe('MgimageController', () => {
  let controller: MgimageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MgimageController],
    }).compile();

    controller = module.get<MgimageController>(MgimageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
