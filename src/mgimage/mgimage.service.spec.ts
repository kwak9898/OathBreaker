import { Test, TestingModule } from '@nestjs/testing';
import { MgimageService } from './mgimage.service';

describe('MgimageService', () => {
  let service: MgimageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MgimageService],
    }).compile();

    service = module.get<MgimageService>(MgimageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
