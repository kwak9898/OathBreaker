import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { AuthService } from "../domains/auth/auth.service";
import { MgObjectFactory, UserFactory } from "./test-factory";
import { RequestHelper } from "../utils/test.utils";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { DatabaseModule } from "../database/database.module";
import { DataSource } from "typeorm";
import { MgObjectUpdateDto } from "../domains/mg-object/dto/request/MgObjectUpdateDto";
import { MGOBJECT_EXCEPTION } from "../exception/error-code";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";

describe("MgObject 테스트", () => {
  let app: INestApplication;
  let token;
  const DOMAIN = "/mg-objects";
  let authService: AuthService;
  let requestHelper: RequestHelper;
  let mgObjectFactory: MgObjectFactory;
  let datasource: DataSource;
  let mgObjects: MgObject[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [MgObjectFactory, MgObjectRepository, DatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    mgObjectFactory = moduleFixture.get(MgObjectFactory);
    datasource = moduleFixture.get(DataSource);
    await datasource.synchronize(true);

    token = authService.getCookieWithJwtAccessToken(
      UserFactory.createBaseUser().userId
    ).accessToken;

    requestHelper = new RequestHelper(app, token);

    await app.init();

    mgObjects = await createBaseMgObject();
  });

  describe("Pagination", () => {
    it("조회 성공", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(DOMAIN + "?page=1&limit=10");

      // Then
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
      expect(body.meta.totalItems).toBe(100);
      expect(body.meta.itemCount).toBe(10);
      expect(body.meta.currentPage).toBe(1);
    });
  });

  describe("상세 조회", () => {
    it("성공", async () => {
      // Given
      const mgObject = mgObjects[0];

      // When
      const { body } = await requestHelper.get(`${DOMAIN}/${mgObject.mgId}`);

      console.log(body);
      // Then
      expect(body).toHaveProperty("imageTotalCnt");
      expect(body).toHaveProperty("imageTempCnt");
      console.log(body);
    });

    it("찾을 수 없음", async () => {
      // Given

      // When
      const response = await requestHelper.get(`${DOMAIN}/not_founded_id`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        MGOBJECT_EXCEPTION.MGOBJECT_NOT_FOUND.message
      );
    });
  });

  describe("수정", () => {
    it("성공", async () => {
      // Given
      const mgObject = mgObjects[1];
      const mgoUpdateDto = new MgObjectUpdateDto();
      mgoUpdateDto.mainMgCategory = "main";
      mgoUpdateDto.mediumMgCategory = "medium";
      mgoUpdateDto.subMgCategory = "sub";

      // When
      const response = await requestHelper.patch(
        `${DOMAIN}/${mgObject.mgId}`,
        mgoUpdateDto
      );

      const body = response.body;

      // Then
      expect(response.statusCode).toBe(200);
      expect(body.mainMgCategory).toBe("main");
      expect(body.mediumMgCategory).toBe("medium");
      expect(body.subMgCategory).toBe("sub");
    });

    it("찾을 수 없음", async () => {
      // Given
      const mgoUpdateDto = new MgObjectUpdateDto();

      // When
      const response = await requestHelper.patch(
        `${DOMAIN}/notfound_mg_id`,
        mgoUpdateDto
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        MGOBJECT_EXCEPTION.MGOBJECT_NOT_FOUND.message
      );
    });
  });

  const createBaseMgObject = async () => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(mgObjectFactory.createBaseMgObject());
    }
    return await Promise.all(promises);
  };
});
