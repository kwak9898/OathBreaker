import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { AuthService } from "../domains/auth/auth.service";
import { getRandomInt, RequestHelper } from "../utils/test.utils";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { DatabaseModule } from "../database/database.module";
import { MgobjectUpdateRequestDto } from "../domains/mg-object/dto/request/mgobject-update-request.dto";
import { MGOBJECT_EXCEPTION } from "../exception/error-code";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgObjectFactory } from "./factory/mgobject-factory";
import { UserFactory } from "./factory/user-factory";
import { UserRepository } from "../domains/users/user.repository";
import { MgoImageRepository } from "../domains/mgo-image/mgo-image.repository";
import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { MyPagination } from "../domains/base/pagination-response";
import { MgObjectListResponseDto } from "../domains/mg-object/dto/response/mgobject-list-response.dto";

describe("MgObject 테스트", () => {
  let app: INestApplication;
  let token;
  const DOMAIN = "/mg-objects";
  let authService: AuthService;
  let requestHelper: RequestHelper;
  let mgObjectFactory: MgObjectFactory;
  let userFactory: UserFactory;
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
        JwtService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    mgObjectFactory = moduleFixture.get(MgObjectFactory);
    userFactory = moduleFixture.get(UserFactory);

    token = authService.createAccessToken(
      (await userFactory.createBaseUser()).userId
    );

    requestHelper = new RequestHelper(app, token);

    await app.init();

    mgObjects = await createBaseMgObject();
  });

  describe("COUNTS", () => {
    it("전체 개수 조회", async () => {
      const response = await requestHelper.get(`${DOMAIN}/counts`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("mgObjectCnt");
      expect(response.body).toHaveProperty("imageTotalCnt");
      expect(response.body).toHaveProperty("tmpCnt");
    });
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

  describe("Search", () => {
    it("MG NAME으로 검색", async () => {
      // given
      const mgNameKeyword =
        mgObjects[getRandomInt(mgObjects.length - 1)].mgName;
      const filteredWithMgName = mgObjects.filter((o) =>
        o.mgName.includes(mgNameKeyword)
      );

      // when
      const response = await requestHelper.get(
        `${DOMAIN}?page=1&limit=10&search=${mgNameKeyword}`
      );
      const data = response.body as MyPagination<MgObjectListResponseDto>;

      // then
      expect(response.status).toBe(200);
      expect(data.items.length).toBeGreaterThanOrEqual(1);
      expect(data.items.length).toBe(filteredWithMgName.length);
    });

    it("MG ID로 검색", async () => {
      // given
      const mgIdKeyword = mgObjects[getRandomInt(mgObjects.length - 1)].mgId;
      const dataFilteredWithId = mgObjects.filter(
        (o) => o.mgId === mgIdKeyword
      );

      // when
      const response = await requestHelper.get(
        `${DOMAIN}?page=1&limit=10&search=${mgIdKeyword}`
      );
      const data = response.body as MyPagination<MgObjectListResponseDto>;

      // then
      expect(response.status).toBe(200);
      expect(data.items.length).toBeGreaterThanOrEqual(1);
      expect(data.items.length).toBe(dataFilteredWithId.length);
    });

    it("MAIN MG CATEGORY로 검색", async () => {
      // given
      const mainMgCategoryKeyword =
        mgObjects[getRandomInt(mgObjects.length - 1)].mainMgCategory;
      const dataFilteredWithCategory = mgObjects.filter((o) =>
        o.mainMgCategory.includes(mainMgCategoryKeyword)
      );

      // when
      const response = await requestHelper.get(
        `${DOMAIN}?page=1&limit=10&search=${mainMgCategoryKeyword}`
      );
      const data = response.body as MyPagination<MgObjectListResponseDto>;

      // then
      expect(response.status).toBe(200);
      expect(data.items.length).toBeGreaterThanOrEqual(1);
      const isItemsHaveMediumMgCategory = data.items.some((o) =>
        dataFilteredWithCategory
          .map((r) => r.mainMgCategory)
          .includes(o.mainMgCategory)
      );
      expect(isItemsHaveMediumMgCategory).toBeTruthy();
    });

    it("MEDIUM MG CATEGORY로 검색", async () => {
      // given
      const mediumMgCategory =
        mgObjects[getRandomInt(mgObjects.length - 1)].mediumMgCategory;
      const dataFilteredWithCategory = mgObjects.filter((o) =>
        o.mediumMgCategory.includes(mediumMgCategory)
      );

      // when
      const response = await requestHelper.get(
        `${DOMAIN}?page=1&limit=10&search=${mediumMgCategory}`
      );
      const data = response.body as MyPagination<MgObjectListResponseDto>;

      // then
      expect(response.status).toBe(200);
      expect(data.items.length).toBeGreaterThanOrEqual(1);
      const isItemsHaveMediumMgCategory = data.items.some((o) =>
        dataFilteredWithCategory
          .map((r) => r.mediumMgCategory)
          .includes(o.mediumMgCategory)
      );
      expect(isItemsHaveMediumMgCategory).toBeTruthy();
    });

    it("SUM MG CATEGORY로 검색", async () => {
      // given
      const subMgCategoryKeyword =
        mgObjects[getRandomInt(mgObjects.length - 1)].subMgCategory;
      const dataFilteredWithCategory = mgObjects.filter((o) =>
        o.subMgCategory.includes(subMgCategoryKeyword)
      );

      // when
      const response = await requestHelper.get(
        `${DOMAIN}?page=1&limit=10&search=${subMgCategoryKeyword}`
      );
      const data = response.body as MyPagination<MgObjectListResponseDto>;

      // then
      expect(response.status).toBe(200);
      expect(data.items.length).toBeGreaterThanOrEqual(1);
      const isItemsHaveSubMgCategory = data.items.some((o) =>
        dataFilteredWithCategory
          .map((r) => r.subMgCategory)
          .includes(o.subMgCategory)
      );
      expect(isItemsHaveSubMgCategory).toBeTruthy();
    });
  });

  describe("상세 조회", () => {
    it("성공", async () => {
      // Given
      const mgObject = mgObjects[0];

      // When
      const { body } = await requestHelper.get(`${DOMAIN}/${mgObject.mgId}`);

      // Then
      expect(body).toHaveProperty("imageTotalCnt");
      expect(body).toHaveProperty("imageTempCnt");
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
      const mgoUpdateDto = new MgobjectUpdateRequestDto();
      mgoUpdateDto.mainMgCategory = faker.name.jobTitle();
      mgoUpdateDto.mediumMgCategory = faker.name.fullName();
      mgoUpdateDto.subMgCategory = faker.name.lastName();
      mgoUpdateDto.mgName = faker.name.lastName();

      // When
      const response = await requestHelper.patch(
        `${DOMAIN}/${mgObject.mgId}`,
        mgoUpdateDto
      );

      const body = response.body;

      // Then
      expect(response.statusCode).toBe(200);
      expect(body.mainMgCategory).toBe(mgoUpdateDto.mainMgCategory);
      expect(body.mediumMgCategory).toBe(mgoUpdateDto.mediumMgCategory);
      expect(body.subMgCategory).toBe(mgoUpdateDto.subMgCategory);
      expect(body.mgName).toBe(mgoUpdateDto.mgName);
    });

    it("찾을 수 없음", async () => {
      // Given
      const mgoUpdateDto = new MgobjectUpdateRequestDto();

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

  describe("mg-object 추천", () => {
    it("성공", async () => {
      // Given
      const imageId = mgObjects[0].mgoImages[0].imgId;

      // When
      const response = await requestHelper.get(
        `${DOMAIN}/ai/recommend/${imageId}`
      );

      // Then
      const body = response.body;
      expect(response.statusCode).toBe(200);
      for (const bodyElement of body) {
        expect(bodyElement).toHaveProperty("mgId");
        expect(bodyElement).toHaveProperty("mgName");
        expect(bodyElement).toHaveProperty("imageUrl");
      }
    });
  });

  describe("mg-object 검색", () => {
    it("성공", async () => {
      // Given
      const searchQueryString = "test";

      // When
      const response = await requestHelper.get(
        `${DOMAIN}/ai/search?query=${searchQueryString}`
      );

      // Then
      const body = response.body;
      expect(response.statusCode).toBe(200);
      for (const bodyElement of body) {
        expect(bodyElement).toHaveProperty("mgId");
        expect(bodyElement).toHaveProperty("mgName");
        expect(bodyElement).toHaveProperty("imageUrl");
        expect(bodyElement).toHaveProperty("mainMgCategory");
        expect(bodyElement).toHaveProperty("mediumMgCategory");
        expect(bodyElement).toHaveProperty("subMgCategory");
      }
    });
  });

  const createBaseMgObject = async (): Promise<Array<MgObject>> => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(mgObjectFactory.createBaseMgObject());
    }
    return await Promise.all(promises);
  };
});
