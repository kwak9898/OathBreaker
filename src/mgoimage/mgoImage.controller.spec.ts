import { Test, TestingModule } from '@nestjs/testing';
import { MgoImageController } from './mgoImage.controller';

describe('MgImageController', () => {
  let controller: MgoImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MgoImageController],
    }).compile();

    controller = module.get<MgoImageController>(MgoImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
