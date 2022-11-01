import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";
import { DatabaseModule } from "../database/database.module";
import { UserRepository } from "../domains/users/user.repository";
import { JwtService } from "@nestjs/jwt";
import { AuthFactory } from "./factory/auth-factory";
import { RequestHelper } from "../utils/test.utils";
import { UserFactory } from "./factory/user-factory";
import { UserDto } from "../domains/users/dto/user.dto";
import { AUTH_EXCEPTION } from "../exception";
import { USER_EXCEPTION } from "../exception/error-code";

describe("회원 인증 관련 테스트", () => {
  let app: INestApplication;
  let usersService: UsersService;
  let authService: AuthService;

  let requestHelper: RequestHelper;
  let authFactory: AuthFactory;
  let userFactory: UserFactory;
  let dataSource: DataSource;

  let token;
  let refreshToken;
  let user;

  const AuthDomain = "/auth";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UserRepository,
        DatabaseModule,
        JwtService,
        AuthService,
        UsersService,
        AuthFactory,
        UserFactory,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);

    authFactory = moduleFixture.get(AuthFactory);
    userFactory = moduleFixture.get(UserFactory);

    dataSource = moduleFixture.get(DataSource);
    await dataSource.synchronize(true);

    token = await authFactory.createTestToken();
    refreshToken = await authFactory.createTestRefreshToken();
    user = await userFactory.createManagerUser();

    requestHelper = new RequestHelper(app, token);

    await app.init();
  });

  describe("로그인 테스트", () => {
    it("성공", async (done) => {
      // Given
      const testUser = await userFactory.createTestUser();
      const dto = new UserDto();

      dto.userId = testUser.userId;
      dto.password = "password123@";

      // When
      const response = await requestHelper.post(`${AuthDomain}/signin`, dto);

      // Then
      const body = response.body;
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.accessToken).not.toBeNull();
      expect(body.refreshToken).not.toBeNull();
      done();
    });

    it("비밀번호가 틀렸을 때 실패", async (done) => {
      // Given
      const testUser = await userFactory.createTestUser();
      const dto = new UserDto();

      dto.userId = testUser.userId;
      dto.password = "password1234@";

      // When
      const response = await requestHelper.post(`${AuthDomain}/signin`, dto);

      // Then
      const body = response.body;
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(body.code).toBe(AUTH_EXCEPTION.AUTH_BAD_REQUEST.code);
      expect(body.message).toBe(AUTH_EXCEPTION.AUTH_BAD_REQUEST.message);
      done();
    });

    it("아이디가 틀렸을 때 실패", async (done) => {
      // Given
      await userFactory.createTestUser();
      const dto = new UserDto();

      dto.userId = "testuser1234";
      dto.password = "password123@";

      // When
      const response = await requestHelper.post(`${AuthDomain}/signin`, dto);

      // Then
      const body = response.body;
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.code).toBe(USER_EXCEPTION.USER_NOT_FOUND.code);
      expect(body.message).toBe(USER_EXCEPTION.USER_NOT_FOUND.message);
      done();
    });

    describe("로그아웃", () => {
      it("성공", async (done) => {
        // Given
        const testUser = await userFactory.createTestUser();
        const dto = new UserDto();
        dto.userId = testUser.userId;
        dto.password = testUser.password;
        dto.refreshToken = refreshToken;

        // When
        const response = await requestHelper.post(`${AuthDomain}/signout`, dto);

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK);
        done();
      });

      it("refreshToken 없으면 실패", async (done) => {
        // Given
        const testUser = await userFactory.createTestUser();
        const dto = new UserDto();
        dto.userId = testUser.userId;
        dto.password = testUser.password;

        // When
        const response = await requestHelper.post(`${AuthDomain}/signout`, dto);

        // Then
        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.body.message).toBe("Unauthorized");
        done();
      });
    });
  });
});
