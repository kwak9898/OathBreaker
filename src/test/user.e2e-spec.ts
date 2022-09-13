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

  describe("회원가입 테스트", () => {
    it("회원가입 성공", async () => {
      // Given
      userId = "test000";
      username = "Tester";
      password = "test1234@";

      // When
      const { body } = await request(app.getHttpServer())
        .post(`${AuthDomain}/register/`)
        .send({ userId: userId, password: password, username: username });
      console.log(body);

      // Then
      expect(body["username"]).toEqual(username);
    });

    it("회원가입 시 비밀번호를 안 적었을 경우", async () => {
      //Given
      userId = "Tester1";
      username = "Tester1";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/register/`)
        .send({ userId: userId, username: username });
      console.log(response);

      // Then
      expect(response.status).toEqual(500);
    });

    it("회원가입한 유저의 로그인", async () => {
      // Given
      userId = "test000";
      password = "test1234@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/login/`)
        .send({ userId: userId, password: password });
      console.log(response);

      //Then
      expect(response.status).toEqual(200);
    });
  });
});
