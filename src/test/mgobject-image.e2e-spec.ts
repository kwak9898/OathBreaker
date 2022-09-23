import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { AuthService } from "../domains/auth/auth.service";
import { getRandomInt, RequestHelper } from "../utils/test.utils";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { DatabaseModule } from "../database/database.module";
import { DataSource } from "typeorm";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgObjectFactory } from "./factory/mgobject-factory";
import { UserFactory } from "./factory/user-factory";
import { MgoImageRepository } from "../domains/mgo-image/mgo-image.repository";
import { UserRepository } from "../domains/users/user.repository";

describe("MgObject Image 테스트", () => {
  let app: INestApplication;
  let token;
  const DOMAIN = "/mgo-images";
  let authService: AuthService;
  let requestHelper: RequestHelper;
  let mgObjectFactory: MgObjectFactory;
  let userFactory: UserFactory;
  let datasource: DataSource;
  let mgObjects: MgObject[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MgObjectFactory,
        MgObjectRepository,
        MgoImageRepository,
        UserFactory,
        UserRepository,
        DatabaseModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    mgObjectFactory = moduleFixture.get(MgObjectFactory);
    userFactory = moduleFixture.get(UserFactory);

    datasource = moduleFixture.get(DataSource);
    await datasource.synchronize(true);

    token = authService.getCookieWithJwtAccessToken(
      (await userFactory.createBaseUser()).userId
    ).accessToken;

    requestHelper = new RequestHelper(app, token);

    await app.init();

    mgObjects = await createBaseMgObject();
  });

  describe("Pagination", () => {
    it("[조회] 전체 => statusFlag = undefined", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${
          mgObjects[getRandomInt(10)].mgId
        }&page=1&limit=10`
      );

      // Then
      expect(body.meta.totalItems).toBe(3);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
    });

    it("[조회] 미완료 => statusFlag = 0", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${
          mgObjects[getRandomInt(10)].mgId
        }&page=1&limit=10&statusFlag=0`
      );

      // Then
      expect(body.meta.totalItems).toBe(3);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
    });

    it("[조회] 전체 => statusFlag = 1", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${
          mgObjects[getRandomInt(10)].mgId
        }&page=1&limit=10&statusFlag=1`
      );

      // Then
      expect(body.meta.totalItems).toBe(0);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
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
