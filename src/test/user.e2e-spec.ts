import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";

describe("계정 관련 테스트", () => {
  let app: INestApplication;
  let usersService: UsersService;
  let authService: AuthService;
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let roleName: string | undefined;
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

    token = authService.createAccessToken(userId);

    await app.init();
  });

  describe("계정 생성/조회/수정/삭제 테스트", () => {
    it("TEST", () => {
      console.log("TEST");
    });
    // it("계정 생성 성공", async (done) => {
    //   // Given
    //   userId = "test000";
    //   username = "tester000";
    //   password = "passwordpw1@";
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .post(`${AuthDomain}/signup`)
    //     .send({
    //       userId,
    //       username,
    //       password,
    //     });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.CREATED);
    //   expect(response.body.userId).toBe(userId);
    //   expect(response.body.username).toBe(username);
    //   done();
    // });
    //
    // it("전체 계정 조회 성공", async (done) => {
    //   // Given
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .get(`${UserDomain}`)
    //     .auth(token, { type: "bearer" });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   done();
    // });
    //
    // it("특정 계정 조회 성공", async (done) => {
    //   // Given
    //   userId = "test000";
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .get(`${UserDomain}/${userId}`)
    //     .auth(token, { type: "bearer" });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   expect(response.body.userId).toBe(userId);
    //   done();
    // });
    //
    // it("특정 계정 수정 성공", async (done) => {
    //   // Given
    //   userId = "test000";
    //   username = "update-user1";
    //   roleName = "등록자";
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .patch(`${UserDomain}/${userId}/update`)
    //     .auth(token, { type: "bearer" })
    //     .send({ userId, username, roleName });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   done();
    // });
    //
    // it("특정 계정 삭제 성공", async (done) => {
    //   // Given
    //   userId = "test000";
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .delete(`${UserDomain}/${userId}/delete`)
    //     .auth(token, { type: "bearer" });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   done();
    // });
  });
});
