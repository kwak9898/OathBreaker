import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";
import { UserFactory } from "./factory/user-factory";
import { UserRepository } from "../domains/users/user.repository";
import { DatabaseModule } from "../database/database.module";
import { JwtService } from "@nestjs/jwt";

describe("접속 로그 관련 테스트", () => {
  let app: INestApplication;
  let token;
  const ConnectLogDomain = "/connect-log";
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let roleName: string | undefined;
  let usersService: UsersService;
  let authService: AuthService;
  let userFactory: UserFactory;
  let databaseSource: DataSource;
  let user;
  let managerUser;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserRepository, UserFactory, DatabaseModule, JwtService],
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

    // 관리자 유저 생성
    user = await userFactory.createBaseUser();

    // 유저 생성
    managerUser = await userFactory.createManagerUser();

    await app.init();
  });

  describe("역할 조회/수정/삭제", () => {
    it("TEST", () => {
      console.log("TEST");
    });
    // it("역할 조회 성공", async (done) => {
    //   // Given
    //
    //   // When
    //   const response = await request(app.getHttpServer())
    //     .get(`${rolesDomain}`)
    //     .auth(token, { type: "bearer" });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   expect(response.body).toStrictEqual({ roles: ["관리자", "등록자"] });
    //   done();
    // });
    //
    // it("역할 수정 성공", async (done) => {
    //   // Given
    //   userId = managerUser.userId;
    //   roleName = "등록자";
    //
    //   // WHen
    //   const response = await request(app.getHttpServer())
    //     .patch(`${rolesDomain}/${userId}`)
    //     .auth(token, { type: "bearer" })
    //     .send({ roleName });
    //
    //   // Then
    //   expect(response.statusCode).toBe(HttpStatus.OK);
    //   expect(response.body.roleName).toBe(roleName);
    //   done();
    // });
  });
});
