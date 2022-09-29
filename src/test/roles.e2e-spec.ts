import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";
import { UserFactory } from "./factory/user-factory";

describe("역할 관련 테스트", () => {
  let app: INestApplication;
  let token;
  const rolesDomain = "/roles";
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let roleName: string | undefined;
  let usersService: UsersService;
  let authService: AuthService;
  let userFactory: UserFactory;
  let databaseSource: DataSource;
  let user;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);
    userFactory = moduleFixture.get(UserFactory);
    databaseSource = moduleFixture.get(DataSource);
    await databaseSource.synchronize(true);

    token = authService.getCookieWithJwtAccessToken(
      (await userFactory.createBaseUser()).userId
    ).accessToken;

    user = await userFactory.createBaseUser();

    await app.init();
  });

  describe("역할 조회/수정/삭제", () => {
    it("역할 조회 성공", async () => {
      // Given
      userId = user.userId;
      roleName = "선택";

      // When
      const response = await request(app.getHttpServer()).get(
        `${rolesDomain}/${userId}/${roleName}`
      );

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it("역할 수정 성공", async () => {
      // Given
      userId = user.userId;
      roleName = "등록자";

      // WHen
      const response = await request(app.getHttpServer())
        .patch(`${rolesDomain}/update/${userId}`)
        .send({ roleName });
      console.log(response.body);

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it("역할 삭제 성공", async () => {
      // Given
    });
  });
});
