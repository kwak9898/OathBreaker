import { Test, TestingModule } from '@nestjs/testing';
import { MgImageController } from './mgoImage.controller';

describe('MgImageController', () => {
  let controller: MgImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MgImageController],
    }).compile();

    controller = module.get<MgImageController>(MgImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
