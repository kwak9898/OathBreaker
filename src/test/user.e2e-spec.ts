import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
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

  beforeEach(async () => {
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
  });

  afterAll(async () => {
    await databaseSource.dropDatabase();
    await databaseSource.destroy();
  });

  describe("계정 생성 테스트", () => {
    it("계정 생성 성공", async () => {
      // Given
      userId = "test000";
      username = "Tester";
      password = "test1234@";

      // When
      const { body } = await request(app.getHttpServer())
        .post(`${UserDomain}`)
        .send({ userId: userId, password: password, username: username });
      console.log(body);

      // Then
      expect(body["username"]).toEqual(username);
    });

    it("계정 생성 시 비밀번호를 안 적을 경우", async () => {
      //Given
      userId = "Tester1";
      username = "Tester1";

      // When
      const response = await request(app.getHttpServer())
        .post(`${UserDomain}`)
        .send({ userId: userId, username: username });
      console.log(response.status);

      // Then
      expect(response.status).toEqual(500);
    });
  });
  describe("계정 조회 테스트", () => {
    it("여러 계정 조회", async () => {
      const response = await request(app.getHttpServer()).get(`${UserDomain}`);
      console.log("여러 계정 조회: ", response.body);

      expect(response.status).toEqual(200);
    });

    it("특정 계정 조회", async () => {
      // Given
      userId = "test134";

      // When
      const response = await request(app.getHttpServer())
        .get(`${UserDomain}`)
        .set({ userId: userId });
      console.log("특정 계정 조회: ", response.body);

      // Then
      expect(response.status).toEqual(200);
      expect(response.body["userId"]).toEqual(userId);
    });

    it("특정 계정 수정", async () => {
      userId = "test000";

      const response = await request(app.getHttpServer()).patch(
        `${UserDomain}`
      );
    });
  });
});
