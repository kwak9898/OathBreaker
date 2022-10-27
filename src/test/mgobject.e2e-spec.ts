import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { getRandomInt, RequestHelper } from "../utils/test.utils";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { DatabaseModule } from "../database/database.module";
import { MgobjectUpdateRequestDto } from "../domains/mg-object/dto/request/mgobject-update-request.dto";
import { MGOBJECT_EXCEPTION } from "../exception/error-code";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgObjectFactory } from "./factory/mgobject-factory";
import { UserRepository } from "../domains/users/user.repository";
import { MgoImageRepository } from "../domains/mgo-image/mgo-image.repository";
import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { CountForDashboardResponseDto } from "../domains/mg-object/dto/response/count-for-dashboard-response.dto";
import { MgobjectDetailResponseDto } from "../domains/mg-object/dto/response/mgobject-detail-response.dto";
import { MyPagination } from "../domains/base/pagination-response";
import { MgObjectListResponseDto } from "../domains/mg-object/dto/response/mgobject-list-response.dto";
import { AuthService } from "../domains/auth/auth.service";
import { UsersService } from "../domains/users/users.service";
import { DataSource } from "typeorm";
import { UserFactory } from "./factory/user-factory";
import { AuthFactory } from "./factory/auth-factory";

describe("MgObject 테스트", () => {
  let app: INestApplication;
  let token;
  const DOMAIN = "/mg-objects";
  let requestHelper: RequestHelper;
  let mgObjectFactory: MgObjectFactory;
  let userFactory: UserFactory;
  let authFactory: AuthFactory;
  let datasource: DataSource;
  let authService: AuthService;
  let mgObjects: MgObject[];

  const totalObjectCnt = 10;
  const totalImageCnt = totalObjectCnt * 8;
  const totalTmpCnt = totalImageCnt / 4;

  const imageCntInObject = 8;
  const unCompleteCntInObject = imageCntInObject / 4;
  const completeCntInObject = imageCntInObject / 4;
  const tmpCntInObject = imageCntInObject / 4;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MgObjectFactory,
        MgObjectRepository,
        MgoImageRepository,
        UserRepository,
        DatabaseModule,
        JwtService,
        AuthService,
        UsersService,
        AuthFactory,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    mgObjectFactory = moduleFixture.get(MgObjectFactory);
    authFactory = moduleFixture.get(AuthFactory);

    token = await authFactory.createTestToken();

    requestHelper = new RequestHelper(app, token);

    await app.init();

    mgObjects = await createBaseMgObject();
  });

  describe("COUNTS", () => {
    it("전체 개수 조회", async () => {
      // when
      const response = await requestHelper.get(`${DOMAIN}/counts`);

      //then
      const body = response.body as CountForDashboardResponseDto;
      expect(response.status).toBe(200);
      expect(body.mgObjectCnt).toBe(totalObjectCnt);
      expect(body.imageTotalCnt).toBe(totalImageCnt);
      expect(body.tmpCnt).toBe(totalTmpCnt);
    });
  });

  describe("Pagination", () => {
    it("조회 성공", async () => {
      // Given

      // When
      const response = await requestHelper.get(DOMAIN + "?page=1&limit=10");
      const body = response.body as MyPagination<MgObjectListResponseDto>;

      // Then
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
      expect(body.meta.totalItems).toBe(totalObjectCnt);
      expect(body.meta.currentPage).toBe(1);

      body.items.forEach((item) => {
        expect(item.createdAt).toBeDefined();
        expect(item.mgId).toBeDefined();
        expect(item.lastTransferToTempAt).toBeDefined();
        expect(item).toHaveProperty("mainMgCategory");
        expect(item).toHaveProperty("mediumMgCategory");
        expect(item).toHaveProperty("subMgCategory");
        expect(item.imageTotalCnt).toBe(imageCntInObject);
        expect(item.imageIncompleteCnt).toBe(unCompleteCntInObject);
        expect(item.imageCompleteCnt).toBe(completeCntInObject);
        expect(item.imageTempCnt).toBe(tmpCntInObject);
      });
    });
  });

  // describe("SOFT DELETE TEST", () => {});

  describe("Search", () => {
    it("MG NAME으로 검색", async () => {
      // given
      const mgNameKeyword = getRandomMgObject().mgName;
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
      const mgIdKeyword = getRandomMgObject().mgId;
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
      const mainMgCategoryKeyword = getRandomMgObject().mainMgCategory;
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
      const mediumMgCategory = getRandomMgObject().mediumMgCategory;
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
      const subMgCategoryKeyword = getRandomMgObject().subMgCategory;
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
      const mgObject = getRandomMgObject();

      // When
      const response = await requestHelper.get(`${DOMAIN}/${mgObject.mgId}`);
      const body = response.body as MgobjectDetailResponseDto;

      // Then
      expect(response.status).toBe(200);
      expect(body.mgId).toBe(mgObject.mgId);
      expect(body.imageTotalCnt).toBe(imageCntInObject);
      expect(body.imageTempCnt).toBe(tmpCntInObject);
      expect(body).toHaveProperty("mainMgCategory");
      expect(body).toHaveProperty("mediumMgCategory");
      expect(body).toHaveProperty("subMgCategory");
    });

    it("찾을 수 없음", async () => {
      // Given

      // When
      const response = await requestHelper.get(`${DOMAIN}/not_founded_id`);

      // Then
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        MGOBJECT_EXCEPTION.MGOBJECT_NOT_FOUND.message
      );
    });
  });

  describe("수정", () => {
    it("성공", async () => {
      // Given
      const mgObject = getRandomMgObject();
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
      const imageId = getRandomMgObject().mgoImages[0].imgId;

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

  function getRandomMgObject() {
    return mgObjects[getRandomInt(totalObjectCnt - 1)];
  }

  const createBaseMgObject = async (): Promise<Array<MgObject>> => {
    const promises = [];
    for (let i = 0; i < totalObjectCnt; i++) {
      promises.push(mgObjectFactory.createBaseMgObject());
    }
    return await Promise.all(promises);
  };
});
