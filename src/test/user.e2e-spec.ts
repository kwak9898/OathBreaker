import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import { User } from "../domains/users/entities/user.entity";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";
import { RolesService } from "../domains/roles/roles.service";

describe("유저 테스트", () => {
  let app: INestApplication;
  let usersRepository: User;
  let usersService: UsersService;
  let authService: AuthService;
  let rolesService: RolesService;
  let date: Date;
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let token;
  const UserDomain = "/users";
  const AuthDomain = "/auth";
  let databaseSource: DataSource;

  beforeAll(async () => {
    userId = "test000";
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    databaseSource = new DataSource({
      type: "postgres",
      host: "127.0.0.1",
      username: "kwaktaemin",
      password: "ian123@",
      database: "test_data",
      port: 5432,
      entities: [User],
    });
    await databaseSource.initialize();
    await databaseSource.synchronize(true);

    token = moduleFixture
      .get<AuthService>(AuthService)
      .getCookieWithJwtAccessToken(userId).accessToken;
  });

  // afterAll(async () => {
  //   //   await databaseSource.dropDatabase();
  //   //   await databaseSource.destroy();
  //   // await app.close();
  //   // server.close();
  // });

  describe("계정 생성/조회/수정/삭제 테스트", () => {
    it("계정 생성 성공", async (done) => {
      // Given

      username = "Tester";
      password = "test1234@";

      console.log(token);

      // When
      const { body } = await request(app.getHttpServer())
        .post(`${AuthDomain}/register`)
        .auth(token, { type: "bearer" })
        .send({ userId, password, username });

      // Then
      expect(body["username"]).toEqual(username);
      done();
    });

    it("계정 전체 조회 테스트", async (done) => {
      // Given

      // When
      const response = await request(app.getHttpServer())
        .get(`${UserDomain}/`)
        .auth(token, { type: "bearer" });

      console.log(token);
      // console.log("계정 조회 테스트", response);
      // console.log("토큰값 : ", token);

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });

    it("특정 계정 삭제 테스트", async (done) => {
      // Given
      userId = "test000";

      // When
      const response = await request(app.getHttpServer())
        .delete(`${UserDomain}/${userId}`)
        .auth(token, { type: "bearer" })
        .set({ userId });

      // console.log("계정 삭제 테스트: ", response);
      // console.log("토큰값 : ", token);

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });
  });
});
