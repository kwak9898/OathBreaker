import { Test, TestingModule } from '@nestjs/testing';
import { MgImageService } from './mg_image.service';

describe('MgImageService', () => {
  let service: MgImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MgImageService],
    }).compile();

    service = module.get<MgImageService>(MgImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
