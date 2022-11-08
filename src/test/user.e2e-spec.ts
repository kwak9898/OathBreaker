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
import { CreateUserDto } from "../domains/users/dto/create-user.dto";
import { Role } from "../domains/roles/enum/role.enum";
import { UserFactory } from "./factory/user-factory";
import { USER_EXCEPTION } from "../exception/error-code";
import { ChangeUserDto } from "../domains/auth/dto/change-user.dto";

describe("계정 생성/조회/수정/삭제 테스트", () => {
  let app: INestApplication;
  let usersService: UsersService;
  let authService: AuthService;

  let requestHelper: RequestHelper;
  let authFactory: AuthFactory;
  let userFactory: UserFactory;
  let dataSource: DataSource;

  let userId: string | undefined;
  let username: string | undefined;
  let roleName: string | undefined;

  let token;
  let user;

  const UserDomain = "/users";
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
    user = await userFactory.createManagerUser();

    requestHelper = new RequestHelper(app, token);

    await app.init();
  });

  describe("계정 생성", () => {
    it("성공", async () => {
      // Given
      const createUserDto = new CreateUserDto();
      createUserDto.userId = "tester123";
      createUserDto.username = "tester";
      createUserDto.team = "운영";
      createUserDto.roleName = Role.manager;
      createUserDto.password = "password123@";
      createUserDto.confirmPassword = "password123@";

      // When
      const response = await requestHelper.post(
        `${AuthDomain}/signup`,
        createUserDto
      );

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(body.userId).toBe(createUserDto.userId);
      expect(body.username).toBe(createUserDto.username);
      expect(body.roleName).toBe(createUserDto.roleName);
      expect(body.team).toBe(createUserDto.team);
    });

    it("ConfirmPassword 없을 때 실패", async () => {
      // Given
      const createUserDto = new CreateUserDto();
      createUserDto.userId = "tester123";
      createUserDto.username = "tester";
      createUserDto.team = "운영";
      createUserDto.roleName = Role.manager;
      createUserDto.password = "password123@";

      // When
      const response = await requestHelper.post(
        `${AuthDomain}/signup`,
        createUserDto
      );
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(body.error).toBe("Bad Request");
      expect(body.message[0]).toBe(
        "confirmPassword must match /^[a-zA-Z0-9`~!@#$%^&*()-_=+]*$/ regular expression"
      );
    });
  });

  describe("전체 계정 조회", () => {
    it("성공", async () => {
      // Given
      await userFactory.createUserList();

      // When
      const response = await requestHelper.get(`${UserDomain}?page=1&limit=10`);

      // Then
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(meta.totalPages).toBe(2);
      expect(meta.itemsPerPage).toBe(10);
    });

    it("관리자인 권한만 조회", async () => {
      // Given
      roleName = encodeURI(Role.admin);

      //When
      const response = await requestHelper.get(
        `${UserDomain}?page=1&limit=10&roleName=${roleName}`
      );

      // Then
      const items = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(items.roleName).toBe(Role.admin);
      expect(meta.totalPages).toBe(1);
      expect(meta.itemsPerPage).toBe(10);
    });

    it("등록자인 권한만 조회", async () => {
      // Given
      roleName = encodeURI(Role.manager);

      // When
      const response = await requestHelper.get(
        `${UserDomain}?page=1&limit=10&roleName=${roleName}`
      );

      // Then
      const items = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(items.roleName).toBe(Role.manager);
      expect(meta.totalPages).toBe(2);
      expect(meta.itemsPerPage).toBe(10);
    });

    it("유저 아이디 검색", async () => {
      // Given
      userId = user.userId;

      // When
      const response = await requestHelper.get(
        `${UserDomain}?page=1&limit=10&userId=${userId}`
      );

      // Then
      const items = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(items.userId).toBe(userId);
      expect(meta.totalItems).toBe(1);
      expect(meta.totalPages).toBe(1);
      expect(meta.itemsPerPage).toBe(10);
    });

    it("사용자 이름 검색", async () => {
      // Given
      username = user.username;

      // When
      const response = await requestHelper.get(
        `${UserDomain}?page=1&limit=10&username=${username}`
      );

      // Then
      const items = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(items.username).toBe(username);
      expect(meta.totalPages).toBe(1);
      expect(meta.itemsPerPage).toBe(10);
    });

    it("특정 유저만 검색", async () => {
      // Given
      userId = user.userId;
      username = user.username;
      roleName = encodeURI(user.roleName);

      // When
      const response = await requestHelper.get(
        `${UserDomain}/?page=1&limit=10&userId=${userId}&username=${username}&roleName=${roleName}`
      );

      // Then
      const items = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(items.userId).toBe(userId);
      expect(items.username).toBe(username);
      expect(items.roleName).toBe(Role.manager);
      expect(meta.totalPages).toBe(1);
      expect(meta.itemsPerPage).toBe(10);
    });
  });

  describe("특정 계정 상세 조회", () => {
    it("성공", async () => {
      // Given
      userId = user.userId;

      // When
      const response = await requestHelper.get(`${UserDomain}/${userId}`);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.userId).toBe(userId);
      expect(body.username).toBe(user.username);
      expect(body.team).toBe(user.team);
      expect(body.roleName).toBe(user.roleName);
    });

    it("존재하는 유저 아이디가 없을 때 실패", async () => {
      // Given
      userId = "notExist123";

      // When
      const response = await requestHelper.get(`${UserDomain}/${userId}`);

      // Then
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.code).toBe(USER_EXCEPTION.USER_NOT_FOUND.code);
      expect(response.body.message).toBe(USER_EXCEPTION.USER_NOT_FOUND.message);
    });
  });

  describe("권한이 부여된 유저 카운트 조회", () => {
    it("관리자 및 등록자 카운트 조회 성공", async () => {
      // When
      const response = await requestHelper.get(`${UserDomain}/roles/count`);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.adminCnt).not.toBe(0);
      expect(body.registerCnt).not.toBe(0);
    });
  });

  describe("특정 유저 수정", () => {
    it("비밀번호 수정", async () => {
      // Given
      const dto = new ChangeUserDto();
      userId = user.userId;
      dto.password = "notPassword111@";

      // When
      const response = await requestHelper.patch(
        `${AuthDomain}/change-user/${userId}`,
        dto
      );

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.userId).toBe(userId);
      expect(body.username).toBe(user.username);
      expect(body.team).toBe(user.team);
      expect(body.roleName).toBe(user.roleName);
      expect(body.updatedAt).not.toBeNull();
    });

    it("권한 변경", async () => {
      // Given
      const dto = new ChangeUserDto();
      dto.roleName = "관리자";
      userId = user.userId;

      // When
      const response = await requestHelper.patch(
        `${AuthDomain}/change-user/${userId}`,
        dto
      );

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.userId).toBe(userId);
      expect(body.roleName).toBe(dto.roleName);
      expect(body.updatedAt).not.toBeNull();
    });
  });

  it("유저 아이디가 존재하지 않으면 비밀번호 및 권한 수정 실패", async () => {
    // Given
    const dto = new ChangeUserDto();
    dto.password = "notExist123";
    dto.roleName = "TestRole";
    userId = "notFound";

    // When
    const response = await requestHelper.patch(
      `${AuthDomain}/change-user/${userId}`,
      dto
    );

    // Then
    const body = response.body;

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.code).toBe(USER_EXCEPTION.USER_NOT_FOUND.code);
    expect(body.message).toBe(USER_EXCEPTION.USER_NOT_FOUND.message);
  });

  describe("유저 최종 접속일 업데이트", () => {
    it("성공", async () => {
      // When
      const response = await requestHelper.patch(
        `${UserDomain}/access/last-date`
      );

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body.affected).toBe(1);
    });

    it("토큰 없으면 실패", async () => {
      // Given
      const NotToken = null;
      const FailRequestHelper = new RequestHelper(app, NotToken);

      // When
      const response = await FailRequestHelper.patch(
        `${UserDomain}/access/last-date`
      );

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe("Unauthorized");
    });
  });

  describe("특정 유저 삭제", () => {
    it("성공", async () => {
      // Given
      userId = user.userId;

      // When
      const response = await requestHelper.delete(`${UserDomain}/${userId}`);

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it("존재하지 않는 유저일 시 실패", async () => {
      // Given
      userId = "notFoundUser123";

      // When
      const response = await requestHelper.delete(`${UserDomain}/${userId}`);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.code).toBe(USER_EXCEPTION.USER_NOT_FOUND.code);
      expect(body.message).toBe(USER_EXCEPTION.USER_NOT_FOUND.message);
    });
  });
});
