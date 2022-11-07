import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { AuthService } from "../domains/auth/auth.service";
import { RequestHelper } from "../utils/test.utils";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { DatabaseModule } from "../database/database.module";
import { MgObjectFactory } from "./factory/mgobject-factory";
import { UserFactory } from "./factory/user-factory";
import { UserRepository } from "../domains/users/user.repository";
import { MgoImageRepository } from "../domains/mgo-image/mgo-image.repository";
import { JwtService } from "@nestjs/jwt";
import { AssignMgService } from "../domains/assign-mg-object/assign-mg-service";
import { AssignMgRepository } from "../domains/assign-mg-object/assign-mg-repository";
import { User } from "../domains/users/entities/user.entity";
import { AssignMgobjectFactory } from "./factory/assign-mgobject-factory";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgObjectService } from "../domains/mg-object/mg-object.service";
import { AssignMgPaginationQuery } from "../domains/assign-mg-object/dto/request/assignMgPaginationQuery";

describe("AssignMgObject 테스트", () => {
  let app: INestApplication;
  let token;
  const DOMAIN = "/assign-mgo";
  let authService: AuthService;
  let requestHelper: RequestHelper;
  let mgObjectFactory: MgObjectFactory;
  let assignMgObjectFactory: AssignMgobjectFactory;
  let userFactory: UserFactory;
  let user: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MgObjectFactory,
        MgObjectRepository,
        MgoImageRepository,
        AssignMgService,
        AssignMgRepository,
        AssignMgobjectFactory,
        MgObjectService,
        UserFactory,
        UserRepository,
        DatabaseModule,
        JwtService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    mgObjectFactory = moduleFixture.get(MgObjectFactory);
    userFactory = moduleFixture.get(UserFactory);
    assignMgObjectFactory = moduleFixture.get(AssignMgobjectFactory);

    user = await userFactory.createBaseUser();
    token = authService.createAccessToken(user.userId);
    requestHelper = new RequestHelper(app, token);

    await app.init();

    await createBaseAssignMgObject();
  });

  describe("COUNTS", () => {
    it("전체 개수 조회", async () => {
      const response = await requestHelper.get(
        `${DOMAIN}/counts?userId=${user.userId}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("mgObjectCnt");
      expect(response.body).toHaveProperty("inCompleteCnt");
      expect(response.body).toHaveProperty("completeCnt");
      expect(response.body).toHaveProperty("tmpCnt");
    });
  });

  describe("Pagination", () => {
    it("조회 성공", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        DOMAIN + `?userId=${user.userId}&page=1&limit=10`
      );

      // Then
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
      expect(body.meta.totalItems).toBe(100);
      expect(body.meta.itemCount).toBe(10);
      expect(body.meta.currentPage).toBe(1);
    });

    it("조회 성공, 작업일(updatedAt) 기준으로 date range", async () => {
      // Given
      const assignMgPaginationQuery = new AssignMgPaginationQuery();
      assignMgPaginationQuery.userId = user.userId;
      assignMgPaginationQuery.page = 1;
      assignMgPaginationQuery.limit = 10;
      assignMgPaginationQuery.startDate = new Date();
      assignMgPaginationQuery.endDate = new Date();

      // When
      const { body } = await requestHelper.get(DOMAIN, assignMgPaginationQuery);

      // Then
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
      expect(body.meta.totalItems).toBe(100);
      expect(body.meta.currentPage).toBe(1);
    });
  });

  describe("할당하기", () => {
    it("성공", async () => {
      // Given
      const mgObject = await mgObjectFactory.createBaseMgObject();

      // When
      const response = await requestHelper.post(
        `${DOMAIN}/assign/${mgObject.mgId}`
      );

      // Then
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("mgObject");
      expect(response.body).toHaveProperty("user");
    });
  });

  const createBaseAssignMgObject = async () => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(mgObjectFactory.createBaseMgObject());
    }
    const promises2 = [];

    const results = await Promise.all(promises);
    for (const result of results) {
      promises2.push(
        assignMgObjectFactory.createBaseAssignMgObject(result as MgObject, user)
      );
    }
    await Promise.all(promises2);
  };
});
