import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { UsersService } from "../models/users/users.service";
import { User } from "../database/entities/user.entity";
import { AuthService } from "../models/auth/auth.service";
import { RolesService } from "../models/roles/roles.service";
import * as request from "supertest";

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
      .getCookieWithJwtAccessToken(userId);
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
      userId = "test000";
      username = "Tester";
      password = "test1234@";

      // When
      const { body } = await request(app.getHttpServer())
        .post(`${UserDomain}`)
        .send({ userId, password, username });
      console.log("계정 생성: ", body);

      // Then
      expect(body["username"]).toEqual(username);
      done();
    });

    it("계정 조회 테스트", async (done) => {
      // Given

      // When
      const response = await request(app.getHttpServer()).get(`${UserDomain}/`);
      console.log("계정 조회 테스트", response.body);

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      done();
    });

    it("계정 수정 테스트", async (done) => {
      // Given
      userId = "test001";
      username = "55";

      // When
      const response = await request(app.getHttpServer())
        .patch(`${UserDomain}/update-user`)
        .set("Authentication", "Bearer " + token)
        .send({ userId, username });
      console.log("계정 수정 테스트: ", response.body);

      // Then
      expect(response.body[userId]).toEqual(userId);
      expect(response.body[username]).toEqual(username);
      done();
    });

    it("계정 삭제 테스트", async (done) => {
      // Given
      userId = "test000";

      // When
      const response = await request(app.getHttpServer())
        .delete(`${UserDomain}/${userId}`)
        .set({ userId });
      console.log("계정 삭제 테스트: ", response.body);

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toBeNull();
      done();
    });
  });
});
