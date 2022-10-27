import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../app.module";
import { getRandomInt, RequestHelper } from "../utils/test.utils";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { DatabaseModule } from "../database/database.module";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgObjectFactory } from "./factory/mgobject-factory";
import { MgoImageRepository } from "../domains/mgo-image/mgo-image.repository";
import { UserRepository } from "../domains/users/user.repository";
import { UpdateMgoImageStatusDto } from "../domains/mgo-image/dto/request/update-mgo-image-status.dto";
import { MgObjectService } from "../domains/mg-object/mg-object.service";
import { UpdateMgoImageMgObjectDto } from "../domains/mgo-image/dto/request/update-mgo-image-mg-object.dto";
import { faker } from "@faker-js/faker";
import {
  MGOBJECT_EXCEPTION,
  MGOIMAGE_EXCEPTION,
} from "../exception/error-code";
import { ImageStatusFlag } from "../domains/mgo-image/entities/mgoImage.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthFactory } from "./factory/auth-factory";
import { AuthService } from "../domains/auth/auth.service";
import { UsersService } from "../domains/users/users.service";

describe("MgObject Image 테스트", () => {
  let app: INestApplication;
  let token;
  const DOMAIN = "/mgo-images";
  let requestHelper: RequestHelper;
  let mgObjectFactory: MgObjectFactory;
  let authFactory: AuthFactory;
  let mgObjects: MgObject[];
  let mgObjectService: MgObjectService;

  const totalObjectCnt = 10;

  const imageCntInObject = 8;
  const unCompleteCntInObject = imageCntInObject / 4;
  const completeCntInObject = imageCntInObject / 4;
  const tmpCntInObject = imageCntInObject / 4;
  const otherCntInObject = (imageCntInObject / 4) * totalObjectCnt;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MgObjectFactory,
        MgObjectRepository,
        MgoImageRepository,
        MgObjectService,
        UserRepository,
        DatabaseModule,
        JwtService,
        AuthFactory,
        AuthService,
        UsersService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    mgObjectFactory = moduleFixture.get(MgObjectFactory);
    authFactory = moduleFixture.get(AuthFactory);
    mgObjectService = moduleFixture.get(MgObjectService);

    token = await authFactory.createTestToken();

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
        `${DOMAIN}?mgObjectId=${getRandomMgObject().mgId}&page=1&limit=10`
      );

      // Then
      expect(body.meta.totalItems).toBe(imageCntInObject);
      expect(body).toHaveProperty("items");
      for (const item of body.items) {
        expect(item).toHaveProperty("isErrorImage");
      }
      expect(body).toHaveProperty("meta");
    });

    it("[조회] 미완료인 상태 => statusFlag = 0", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${
          getRandomMgObject().mgId
        }&page=1&limit=10&statusFlag=${ImageStatusFlag.UNCOMPLETED}`
      );

      // Then
      expect(body.meta.totalItems).toBe(unCompleteCntInObject);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
    });

    it("[조회] 완료된 상태 => statusFlag = 1", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${
          getRandomMgObject().mgId
        }&page=1&limit=10&statusFlag=${ImageStatusFlag.COMPLETED}`
      );

      // Then
      expect(body.meta.totalItems).toBe(completeCntInObject);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("meta");
    });

    it("[조회] temp 상태 => statusFlag = 2", async () => {
      // Given

      // When
      const { body } = await requestHelper.get(
        `${DOMAIN}?mgObjectId=${
          getRandomMgObject().mgId
        }&page=1&limit=10&statusFlag=${ImageStatusFlag.TEMP}`
      );

      // Then
      expect(body.meta.totalItems).toBe(tmpCntInObject);
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
      expect(body.meta.totalItems).toBe(otherCntInObject);
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

    it("검수 완료로 상태 변경하기", async () => {
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

      for (const item of body.items) {
        expect(item.statusFlag).toBe(ImageStatusFlag.COMPLETED);
      }
    });

    it("temp로 상태 변경하기", async () => {
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

      for (const item of body.items) {
        expect(item.statusFlag).toBe(ImageStatusFlag.TEMP);
        expect(item).toHaveProperty("isErrorImage");
      }
      const afterTransferTemp = await mgObjectService.findOneOrFail(
        mgObject.mgId
      );
      expect(mgObject.lastTransferToTempAt).toBe(null);
      // temp 이동 했으므로 lastTransferToTempAt 값이 있어야 한다.
      expect(afterTransferTemp.lastTransferToTempAt).not.toBe(null);
    });

    it("other로 상태 변경하기", async () => {
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

      for (const item of body.items) {
        expect(item).toHaveProperty("isErrorImage");
        expect(item.statusFlag).toBe(ImageStatusFlag.OTHER);
      }
    });
  });

  describe("IMAGE에 새로운  MG ID를 부여 ", () => {
    it("성공", async () => {
      // Given
      const { mgObject, targetObject } = twoMgObject();

      const mgoImage = mgObject.mgoImages.map((image) => image.imgId)[
        getRandomInt(mgObject.mgoImages.length - 1)
      ];

      const dto = new UpdateMgoImageMgObjectDto();
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
      const targetObject = getRandomMgObject();

      const dto = new UpdateMgoImageMgObjectDto();
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
        getRandomInt(mgObject.mgoImages.length - 1)
      ];

      const dto = new UpdateMgoImageMgObjectDto();
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
      const dto = new UpdateMgoImageMgObjectDto();
      dto.imageId = null;
      dto.mgObjectId = null;

      // when
      const response = await requestHelper.patch(`${DOMAIN}/mgobject`, dto);

      // then
      expect(response.statusCode).toBe(400);
    });
  });

  function getRandomMgObject() {
    return mgObjects[getRandomInt(totalObjectCnt - 1)];
  }

  function twoMgObject() {
    const mgObject = getRandomMgObject();
    let targetObject = getRandomMgObject();
    while (mgObject.mgId == targetObject.mgId) {
      targetObject = getRandomMgObject();
    }
    return { mgObject, targetObject };
  }

  const createBaseMgObject = async (): Promise<Array<MgObject>> => {
    const promises = [];
    for (let i = 0; i < totalObjectCnt; i++) {
      promises.push(mgObjectFactory.createBaseMgObject());
    }
    return await Promise.all(promises);
  };
});
