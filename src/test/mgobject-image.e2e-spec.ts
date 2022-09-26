import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
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
import { UpdateMgoImageStatusDto } from "../domains/mgo-image/dto/UpdateMgoImageStatusDto";
import { MgObjectService } from "../domains/mg-object/mg-object.service";
import { UpdateMgoImageObjectDto } from "../domains/mgo-image/dto/UpdateMgoImageObjectDto";
import { faker } from "@faker-js/faker";
import {
  MGOBJECT_EXCEPTION,
  MGOIMAGE_EXCEPTION,
} from "../exception/error-code";
import { ImageStatusFlag } from "../domains/mgo-image/entities/mgoImage.entity";

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
  let mgObjectService: MgObjectService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MgObjectFactory,
        MgObjectRepository,
        MgoImageRepository,
        MgObjectService,
        UserFactory,
        UserRepository,
        DatabaseModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    mgObjectFactory = moduleFixture.get(MgObjectFactory);
    userFactory = moduleFixture.get(UserFactory);
    mgObjectService = moduleFixture.get(MgObjectService);

    datasource = moduleFixture.get(DataSource);
    await datasource.synchronize(true);

    token = authService.getCookieWithJwtAccessToken(
      (await userFactory.createBaseUser()).userId
    ).accessToken;

    requestHelper = new RequestHelper(app, token);

    app.useGlobalPipes(new ValidationPipe());

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

    it("[조회] 미완료인 상태인 이미지만 => statusFlag = 0", async () => {
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

    it("[조회] 완료된 상태인 이미지만 => statusFlag = 1", async () => {
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

    it("[조회] temp 상태인 이미지만 => statusFlag = 2", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${
          mgObjects[getRandomInt(10)].mgId
        }&page=1&limit=10&statusFlag=${ImageStatusFlag.TEMP}`
      );

      // Then
      expect(body.meta.totalItems).toBe(0);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
    });

    it("[조회] other 상태인 이미지만 => statusFlag = 3", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?page=1&limit=10&statusFlag=${ImageStatusFlag.OTHER}`
      );

      // Then
      expect(body.meta.totalItems).toBe(0);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
    });
  });

  describe("Update Status Flag", () => {
    it("flag가 빈 값일 때 400", async () => {
      // Given
      const mgObject = getRandomMgObject();
      const dto = new UpdateMgoImageStatusDto();
      dto.imageIds = mgObject.mgoImages.map((image) => image.imgId);
      dto.statusFlag = null;

      // When
      const response = await requestHelper.patch(`${DOMAIN}/status`, dto);

      // Then
      expect(response.status).toBe(400);
    });

    it("mgo images list가 빈 값일 때 400", async () => {
      // Given
      const dto = new UpdateMgoImageStatusDto();
      dto.imageIds = [];
      dto.statusFlag = ImageStatusFlag.COMPLETED;

      // When
      const response = await requestHelper.patch(`${DOMAIN}/status`, dto);

      // Then
      expect(response.status).toBe(400);
    });

    it("검수 완료로 일괄 처리하기", async () => {
      // Given
      const mgObject = getRandomMgObject();
      const imageIds = mgObject.mgoImages.map((image) => image.imgId);
      const dto = new UpdateMgoImageStatusDto();
      dto.imageIds = imageIds;
      dto.statusFlag = ImageStatusFlag.COMPLETED;

      // When
      const response = await requestHelper.patch(`${DOMAIN}/status`, dto);

      // Then
      expect(response.status).toBe(200);

      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${mgObject.mgId}&page=1&limit=10&statusFlag=${ImageStatusFlag.COMPLETED}`
      );

      expect(body.meta.itemCount).toBe(3);
      for (const item of body.items) {
        expect(item.statusFlag).toBe(ImageStatusFlag.COMPLETED);
      }
    });

    it("temp일괄 처리하기", async () => {
      // Given
      const mgObject = getRandomMgObject();
      const imageIds = mgObject.mgoImages.map((image) => image.imgId);
      const dto = new UpdateMgoImageStatusDto();
      dto.imageIds = imageIds;
      dto.statusFlag = ImageStatusFlag.TEMP;

      // When
      const response = await requestHelper.patch(`${DOMAIN}/status`, dto);

      // Then
      expect(response.status).toBe(200);

      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${mgObject.mgId}&page=1&limit=10&statusFlag=${ImageStatusFlag.TEMP}`
      );

      expect(body.meta.itemCount).toBe(3);
      for (const item of body.items) {
        expect(item.statusFlag).toBe(ImageStatusFlag.TEMP);
      }
      const afterTransferTemp = await mgObjectService.findOneOrFail(
        mgObject.mgId
      );
      expect(mgObject.lastTransferToTempAt).toBe(null);
      // temp 이동 했으므로 lastTransferToTempAt 값이 있어야 한다.
      expect(afterTransferTemp.lastTransferToTempAt).not.toBe(null);
    });

    it("other 일괄 처리하기", async () => {
      // Given
      const mgObject = getRandomMgObject();
      const imageIds = mgObject.mgoImages.map((image) => image.imgId);
      const dto = new UpdateMgoImageStatusDto();
      dto.imageIds = imageIds;
      dto.statusFlag = ImageStatusFlag.OTHER;

      // When
      const response = await requestHelper.patch(`${DOMAIN}/status`, dto);

      // Then
      expect(response.status).toBe(200);

      const { body } = await requestHelper.get(
        `${DOMAIN}?page=1&limit=10&statusFlag=${ImageStatusFlag.OTHER}`
      );

      expect(body.meta.itemCount).toBe(3);
      for (const item of body.items) {
        expect(item.statusFlag).toBe(ImageStatusFlag.OTHER);
      }
    });
  });

  describe("IMAGE에 새로운  MG ID를 부여 ", () => {
    it("성공", async () => {
      // Given
      const mgObject = getRandomMgObject();
      let targetObject = mgObjects[getRandomInt(100)];
      while (mgObject.mgId == targetObject.mgId) {
        targetObject = mgObjects[getRandomInt(100)];
      }

      const mgoImage = mgObject.mgoImages.map((image) => image.imgId)[
        getRandomInt(3)
      ];

      const dto = new UpdateMgoImageObjectDto();
      dto.imageId = mgoImage;
      dto.mgObjectId = targetObject.mgId;

      // when
      const { body } = await requestHelper.patch(`${DOMAIN}/mgobject`, dto);

      // then
      expect(body.mgObject.mgId).toBe(dto.mgObjectId);
      expect(body.statusFlag).toBe(ImageStatusFlag.COMPLETED);
    });

    it("이미지를 찾을 수 없음", async () => {
      // Given
      const mgObject = getRandomMgObject();
      let targetObject = mgObjects[getRandomInt(100)];
      while (mgObject.mgId == targetObject.mgId) {
        targetObject = mgObjects[getRandomInt(100)];
      }

      const dto = new UpdateMgoImageObjectDto();
      dto.imageId = faker.random.word();
      dto.mgObjectId = targetObject.mgId;

      // when
      const response = await requestHelper.patch(`${DOMAIN}/mgobject`, dto);

      // then
      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe(
        MGOIMAGE_EXCEPTION.MGOIMAGE_NOT_FOUND.code
      );
      expect(response.body.message).toBe(
        MGOIMAGE_EXCEPTION.MGOIMAGE_NOT_FOUND.message
      );
    });

    it("MG ID를 찾을 수 없음", async () => {
      // Given
      const mgObject = getRandomMgObject();

      const mgoImageId = mgObject.mgoImages.map((image) => image.imgId)[
        getRandomInt(3)
      ];

      const dto = new UpdateMgoImageObjectDto();
      dto.imageId = mgoImageId;
      dto.mgObjectId = faker.random.word();

      // when
      const response = await requestHelper.patch(`${DOMAIN}/mgobject`, dto);

      // then
      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe(
        MGOBJECT_EXCEPTION.MGOBJECT_NOT_FOUND.code
      );
      expect(response.body.message).toBe(
        MGOBJECT_EXCEPTION.MGOBJECT_NOT_FOUND.message
      );
    });

    it("MG ID, IMAGE ID EMTPY", async () => {
      // Given
      const dto = new UpdateMgoImageObjectDto();
      dto.imageId = null;
      dto.mgObjectId = null;

      // when
      const response = await requestHelper.patch(`${DOMAIN}/mgobject`, dto);

      // then
      expect(response.statusCode).toBe(400);
    });
  });

  describe("TEMP IMAGE LIST", () => {
    it("성공", async () => {
      const mgObject = getRandomMgObject();
      const imageIds = mgObject.mgoImages.map((image) => image.imgId);
      const dto = new UpdateMgoImageStatusDto();
      dto.imageIds = imageIds;
      dto.statusFlag = ImageStatusFlag.TEMP;

      // When
      const response = await requestHelper.patch(`${DOMAIN}/status`, dto);

      // Then
      expect(response.status).toBe(200);

      const { body } = await requestHelper.get(
        `${DOMAIN}/${mgObject.mgId}/temp`
      );

      expect(body.length).toBe(3);

      for (const item of body) {
        expect(item.statusFlag).toBe(ImageStatusFlag.TEMP);
      }
    });
  });

  function getRandomMgObject() {
    return mgObjects[getRandomInt(100)];
  }

  const createBaseMgObject = async () => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(mgObjectFactory.createBaseMgObject());
    }
    return await Promise.all(promises);
  };
});
