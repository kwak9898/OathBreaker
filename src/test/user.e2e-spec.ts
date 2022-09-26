import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";

describe("유저 테스트", () => {
  let app: INestApplication;
  let usersService: UsersService;
  let authService: AuthService;
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let token;
  const UserDomain = "/users";
  const AuthDomain = "/auth";
  let databaseSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);
    databaseSource = moduleFixture.get(DataSource);
    await databaseSource.synchronize(true);

    token = authService.getCookieWithJwtAccessToken(userId).accessToken;

    await app.init();
  });

  describe("계정 생성/조회/수정/삭제 테스트", () => {
    it("계정 생성 성공", async (done) => {
      // Given

      userId = "test000";
      username = "Tester";
      password = "test1234@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/register`)
        .auth(token, { type: "bearer" })
        .send({ userId, password, username });

      // Then
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body["userId"]).toEqual(userId);
      expect(response.body["username"]).toEqual(username);
      done();
    });

    it("계정 전체 조회 테스트", async (done) => {
      // Given

      // When
      const response = await request(app.getHttpServer())
        .get(`${UserDomain}/`)
        .auth(token, { type: "bearer" });

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });

    it("특정 계정 조회 테스트", async (done) => {
      // Given
      userId = "test000";

      // When
      const response = await request(app.getHttpServer())
        .get(`${UserDomain}/${userId}`)
        .auth(token, { type: "bearer" })
        .set({ userId });

      // Then
      expect(response.body["userId"]).toEqual(userId);
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });

    // it("특정 계정 삭제 테스트", async (done) => {
    //   // Given
    //   userId = "test000";
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .delete(`${UserDomain}/${userId}`)
    //     .auth(token, { type: "bearer" })
    //     .set({ userId });
    //
    //   // Then
    //   expect(response.status).toEqual(HttpStatus.OK);
    //   done();
    // });
  });
});
