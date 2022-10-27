import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";
import { UserFactory } from "./factory/user-factory";
import { DatabaseModule } from "../database/database.module";
import { UserRepository } from "../domains/users/user.repository";
import { JwtService } from "@nestjs/jwt";

describe("계정 관련 테스트", () => {
  let app: INestApplication;
  let usersService: UsersService;
  let authService: AuthService;
  let userFactory: UserFactory;
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let roleName: string | undefined;
  let confirmPassword: string | undefined;
  let team: string | undefined;
  let token;
  const UserDomain = "/users";
  const AuthDomain = "/auth";
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
    await databaseSource.synchronize(true);

    token = authService.createAccessToken(
      (await userFactory.createBaseUser()).userId
    );

    await app.init();
  });

  describe("계정 생성/조회/수정/삭제 테스트", () => {
    it("계정 생성 성공", async (done) => {
      // Given
      userId = "test000";
      username = "tester000";
      password = "passwordpw11@";
      roleName = "등록자";
      confirmPassword = "passwordpw11@";
      team = "운영";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/signup`)
        .auth(token, { type: "bearer" })
        .send({
          userId,
          username,
          password,
          roleName,
          confirmPassword,
          team,
        });

      // Then
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body.userId).toBe(userId);
      expect(response.body.username).toBe(username);
      expect(response.body.roleName).toBe(roleName);
      expect(response.body.team).toBe(team);
      done();
    });

    it("전체 계정 조회 성공", async (done) => {
      // Given

      // When
      const response = await request(app.getHttpServer())
        .get(`${UserDomain}?page=1&limit=10`)
        .auth(token, { type: "bearer" });

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty("items");
      done();
    });

    it("특정 계정 조회 성공", async (done) => {
      // Given
      userId = "test000";

      // When
      const response = await request(app.getHttpServer())
        .get(`${UserDomain}/${userId}`)
        .auth(token, { type: "bearer" });

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body.userId).toBe(userId);
      done();
    });

    // it("관리자 or 등록자인 유저 카운트 조회 성공", async (done) => {
    //   // Given
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .get(`${UserDomain}/roles/count/?page=1&limit=10`)
    //     .auth(token, { type: "bearer" });
    //
    //   console.log(response);
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    // });

    it("특정 계정 수정 성공", async (done) => {
      // Given
      userId = "test000";
      username = "update-user1";
      roleName = "관리자";

      // When
      const response = await request(app.getHttpServer())
        .patch(`${UserDomain}/${userId}`)
        .auth(token, { type: "bearer" })
        .send({ userId, username, roleName });

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
      done();
    });

    it("유저 퇴종 접속일 업데이트 성공", async (done) => {
      // Given

      // When
      const response = await request(app.getHttpServer())
        .patch(`${UserDomain}/access/last-date`)
        .auth(token, { type: "bearer" });

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
      done();
    });

    it("특정 계정 삭제 성공", async (done) => {
      // Given
      userId = "test000";

      // When
      const response = await request(app.getHttpServer())
        .delete(`${UserDomain}/${userId}`)
        .auth(token, { type: "bearer" });

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
      done();
    });
  });
});
