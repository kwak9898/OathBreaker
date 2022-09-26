import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import { AuthService } from "../domains/auth/auth.service";
import { UsersService } from "../domains/users/users.service";

describe("회원 인증 관련 테스트", () => {
  let app: INestApplication;
  let token;
  let refreshToken;
  const AuthDomain = "/auth";
  let authService: AuthService;
  let usersService: UsersService;
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let roleName: string;
  let databaseSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);
    databaseSource = moduleFixture.get(DataSource);
    await databaseSource.synchronize(false);

    token = authService.getCookieWithJwtAccessToken(userId).accessToken;

    refreshToken =
      authService.getCookieWithJwtRefreshToken(userId).refreshToken;

    await app.init();
  });

  describe("계성 생성 테스트", () => {
    it("생성 성공", async (done) => {
      // Given
      userId = "testian123";
      username = "testian";
      password = "test12345@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .send({ userId, username, password });

      // Then
      expect(response.statusCode).toBe(201);
      expect(response.body["userId"]).toBe(userId);
      expect(response.body["username"]).toBe(username);
      done();
    });

    it("생성 시 아이디 길이가 4이하일 경우", async (done) => {
      //Given
      userId = "re1";
      username = "testian1";
      password = "test12345@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .send({ userId, username, password });

      // Then
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Bad Request");
      done();
    });

    it("생성 시 유저의 이름의 길이가 4이하일 경우", async (done) => {
      // Given
      userId = "testtest123";
      username = "ian";
      password = "test12345@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .send({ userId, username, password });

      // Then
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Bad Request");
      done();
    });

    it("생성 시 유저의 비밀번호의 길이가 10이하일 경우", async (done) => {
      // Given
      userId = "testtest123";
      username = "ian";
      password = "test12@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .send({ userId, username, password });

      // Then
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Bad Request");
      done();
    });
  });

  describe("로그인 테스트", () => {
    it("로그인 성공", async (done) => {
      // Given
      userId = "testian123";
      password = "test12345@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signin`)
        .send({ userId, password });

      // Then
      expect(response.status).toEqual(HttpStatus.CREATED);
      done();
    });

    it("로그아웃 성공 테스트", async (done) => {
      // Given
      userId = "testian123";
      password = "test12345@";
      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/logout`)
        .auth(token, { type: "bearer" })
        .send({ userId, password });

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });

    it("비밀번호 변경 성공 테스트", async (done) => {
      // Given
      userId = "testian123";
      password = "test123457@";

      // When
      const response = await request(app.getHttpServer())
        .patch(`${AuthDomain}/change-password`)
        .auth(refreshToken, { type: "bearer" })
        .send({ userId, password });

      console.log("비밀번호 변경 성공 테스트 : ", response.error);

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });
  });

  // describe("실패", () => {
  //   it("로그인 실패 테스트", async (done) => {
  //     // TODO 추후 구현 예정
  //     // Given
  //     userId = "test000";
  //     password = "test123@";
  //
  //     // When
  //     const response = await request(app.getHttpServer()).post(
  //       `${AuthDomain}/login`
  //     );
  //   });
  //
  //   it("로그아웃 실패 테스트", async (done) => {
  //     it.todo("추후 구현 예정");
  //   });
  //
  //   it("비밀번호 변경 실패 테스트", async (done) => {
  //     it.todo("추후 구현 예정");
  //   });
  // });
});
