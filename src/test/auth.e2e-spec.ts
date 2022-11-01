import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import { AuthService } from "../domains/auth/auth.service";
import { UsersService } from "../domains/users/users.service";
import { UserFactory } from "./factory/user-factory";
import { DatabaseModule } from "../database/database.module";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "../domains/users/user.repository";

describe("회원 인증 관련 테스트", () => {
  let app: INestApplication;
  let token;
  let refreshToken;
  const AuthDomain = "/auth";
  let authService: AuthService;
  let usersService: UsersService;
  let userFactory: UserFactory;
  let userId: string;
  let username: string;
  let password: string;
  let confirmPassword: string;
  let roleName: string;
  let team: string;
  let databaseSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, DatabaseModule, UserRepository, JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);
    userFactory = moduleFixture.get(UserFactory);
    databaseSource = moduleFixture.get(DataSource);
    await databaseSource.synchronize(false);

    token = authService.createAccessToken(
      (await userFactory.createBaseUser()).userId
    );

    refreshToken = authService.createRefreshToken(
      (await userFactory.createBaseUser()).userId
    );

    await app.init();
  });

  describe("계성 생성 테스트", () => {
    it("생성 성공", async (done) => {
      // Given
      userId = "testuser123";
      username = "tester";
      password = "test12345@";
      confirmPassword = "test12345@";
      roleName = "등록자";
      team = "운영";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .auth(token, { type: "bearer" })
        .send({ userId, username, password, confirmPassword, roleName, team });

      // Then
      expect(response.statusCode).toBe(201);
      expect(response.body["userId"]).toBe(userId);
      expect(response.body["username"]).toBe(username);
      done();
    });

    it("생성 시 아이디 길이가 4이하일 경우", async (done) => {
      //Given
      userId = "re1";
      username = "tester";
      password = "test12345@";
      confirmPassword = "test12345@";
      roleName = "관리자";
      team = "운영";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .auth(token, { type: "bearer" })
        .send({ userId, username, password, confirmPassword, roleName, team });

      // Then
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Bad Request");
      done();
    });

    it("생성 시 유저의 이름의 길이가 4이하일 경우", async (done) => {
      // Given
      userId = "testtest123";
      username = "tnt";
      password = "test12345@";
      confirmPassword = "test12345@";
      roleName = "등록자";
      team = "운영";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .auth(token, { type: "bearer" })
        .send({ userId, username, password, confirmPassword, roleName, team });

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
        .auth(token, { type: "bearer" })
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
      userId = "testuser123";
      password = "test12345@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signin`)
        .send({ userId, password });

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });

    it("로그아웃 성공 테스트", async (done) => {
      // Given
      userId = "testuser123";
      password = "test12345@";
      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signout`)
        // .auth(refreshToken, { type: "bearer" })
        .send({ userId, password, refreshToken });

      // Then
      expect(response.status).toEqual(HttpStatus.CREATED);
      done();
    });

    // it("비밀번호 변경 성공 테스트", async (done) => {
    //   // Given
    //   userId = "testuser123";
    //   password = "test123457@";
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .patch(`${AuthDomain}/change-password/${userId}`)
    //     .auth(token, { type: "bearer" })
    //     .send({ userId, password });
    //
    //   // Then
    //   expect(response.status).toEqual(HttpStatus.OK);
    //   done();
    // });
  });
});
