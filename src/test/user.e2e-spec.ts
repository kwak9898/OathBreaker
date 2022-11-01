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

describe("계정 관련 테스트", () => {
  let app: INestApplication;
  let usersService: UsersService;
  let authService: AuthService;

  let requestHelper: RequestHelper;
  let authFactory: AuthFactory;
  let userFactory: UserFactory;
  let dataSource: DataSource;

  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let roleName: string | undefined;
  let confirmPassword: string | undefined;
  let team: string | undefined;

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

  describe("계정 생성/조회/수정/삭제", () => {
    describe("계정 생성", () => {
      it("성공", async (done) => {
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
        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body.userId).toBe(createUserDto.userId);
        expect(response.body.username).toBe(createUserDto.username);
        expect(response.body.roleName).toBe(createUserDto.roleName);
        expect(response.body.team).toBe(createUserDto.team);
        done();
      });

      it("ConfirmPassword 없을 때 실패", async (done) => {
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

        console.log(response.body);

        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.message[0]).toBe(
          "confirmPassword must match /^[a-zA-Z0-9`~!@#$%^&*()-_=+]*$/ regular expression"
        );
        done();
      });
    });

    describe("전체 계정 조회", () => {
      it("성공", async (done) => {
        // When
        const response = await requestHelper.get(
          `${UserDomain}?page=1&limit=10`
        );

        // Then
        const bodyMeta = response.body.meta;
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(bodyMeta.totalPages).toBe(1);
        expect(bodyMeta.itemsPerPage).toBe(10);
        done();
      });

      it("등록자인 권한만 조회", async (done) => {
        // Given
        roleName = encodeURI(Role.manager);
        // When
        const response = await requestHelper.get(
          `${UserDomain}?page=1&limit=10&roleName=${roleName}`
        );

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items[0].roleName).toBe(Role.manager);
        expect(response.body.meta.totalPages).toBe(1);
        expect(response.body.meta.itemsPerPage).toBe(10);
        done();
      });

      it("유저 아이디 검색", async (done) => {
        // Given
        userId = user.userId;

        // When
        const response = await requestHelper.get(
          `${UserDomain}?page=1&limit=10&userId=${userId}`
        );

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items[0].userId).toBe(userId);
        expect(response.body.meta.totalPages).toBe(1);
        expect(response.body.meta.itemsPerPage).toBe(10);
        done();
      });

      it("사용자 이름 검색", async (done) => {
        // Given
        username = user.username;

        // When
        const response = await requestHelper.get(
          `${UserDomain}?page=1&limit=10&username=${username}`
        );

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items[0].username).toBe(username);
        expect(response.body.meta.totalPages).toBe(1);
        expect(response.body.meta.itemsPerPage).toBe(10);
        done();
      });
    });

    it("특정 유저만 검색", async (done) => {
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
      done();
    });

    describe("특정 계정 조회", () => {
      it("성공", async (done) => {
        // Given
        userId = user.userId;

        // When
        const response = await requestHelper.get(`${UserDomain}/${userId}`);
        console.log(response.body);

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.userId).toBe(userId);
        done();
      });

      it("존재하는 유저 아이디가 없을 때 실패", async (done) => {
        // Given
        userId = "test2022";

        // When
        const response = await requestHelper.get(`${UserDomain}/${userId}`);

        // Then
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(response.body.code).toBe(USER_EXCEPTION.USER_NOT_FOUND.code);
        expect(response.body.message).toBe(
          USER_EXCEPTION.USER_NOT_FOUND.message
        );
        done();
      });
    });

    describe("권한이 부여된 유저 카운트 조회", () => {
      it("관리자 및 등록자 카운트 조회 성공", async (done) => {
        // When
        const response = await requestHelper.get(`${UserDomain}/roles/count`);

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK);
        done();
      });
    });

    describe("특정 유저 수정", () => {
      it("비밀번호 수정", async (done) => {
        // Given
        const dto = new ChangeUserDto();
        dto.password = "testpassword1";
        userId = user.userId;

        // When
        const response = await requestHelper.patch(
          `${AuthDomain}/change-user/${userId}`,
          dto
        );

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK);
        done();
      });

      it("권한 변경", async (done) => {
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
        expect(response.statusCode).toBe(HttpStatus.OK);
        done();
      });
    });
    // it("특정 계정 수정 성공", async (done) => {
    //   // Given
    //   userId = "test000";
    //   username = "update-user1";
    //   roleName = "관리자";
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .patch(`${UserDomain}/${userId}`)
    //     .auth(token, { type: "bearer" })
    //     .send({ userId, username, roleName });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   done();
    // });
    //
    // it("유저 퇴종 접속일 업데이트 성공", async (done) => {
    //   // Given
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .patch(`${UserDomain}/access/last-date`)
    //     .auth(token, { type: "bearer" });
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
    //     .delete(`${UserDomain}/${userId}`)
    //     .auth(token, { type: "bearer" });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   done();
    // });
  });
});
