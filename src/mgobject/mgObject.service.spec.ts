import { Test, TestingModule } from "@nestjs/testing";
import { MgObjectService } from "./mgObject.service";

describe("MgObjectService", () => {
  let service: MgObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MgObjectService],
    }).compile();

    service = module.get<MgObjectService>(MgObjectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
