import { Test, TestingModule } from '@nestjs/testing';
import { OathUserService } from './oathUser.service';

describe('OathuserService', () => {
  let service: OathUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OathUserService],
    }).compile();

    service = module.get<OathUserService>(OathUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
