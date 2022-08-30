import { Test, TestingModule } from '@nestjs/testing';
import { MgoImageService } from './mgoImage.service';

describe('MgImageService', () => {
  let service: MgoImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MgoImageService],
    }).compile();

    service = module.get<MgoImageService>(MgoImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
