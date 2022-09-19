import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import { User } from "../domains/users/entities/user.entity";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";
import { RolesService } from "../domains/roles/roles.service";

describe("회원 인증 관련 테스트", () => {
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

  describe("로그인, 로그아웃, 비밀번호 변경 테스트", () => {
    it("로그인 성공 테스트", async (done) => {
      // Given
      userId = "test000";
      password = "test123@";

      // When
      const response = await request(app.getHttpServer())
        .post(`${AuthDomain}/login`)
        .auth(token, { type: "bearer" })
        .send({ userId, password });

      console.log(response.body);

      // Then
      expect(response.status).toEqual(HttpStatus.OK);
    });
  });
});
