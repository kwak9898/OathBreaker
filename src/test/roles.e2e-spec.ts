import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { UsersService } from "../domains/users/users.service";
import { AuthService } from "../domains/auth/auth.service";
import { UserFactory } from "./factory/user-factory";

describe("역할 관련 테스트", () => {
  let app: INestApplication;
  let token;
  const rolesDomain = "/roles";
  let userId: string | undefined;
  let username: string | undefined;
  let password: string | undefined;
  let roleName: string | undefined;
  let usersService: UsersService;
  let authService: AuthService;
  let userFactory: UserFactory;
  let databaseSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);
    userFactory = moduleFixture.get(UserFactory);
    databaseSource = moduleFixture.get(DataSource);
    await databaseSource.synchronize(true);

    token = authService.getCookieWithJwtAccessToken(
      (await userFactory.createBaseUser()).userId
    ).accessToken;

    await app.init();
  });

  describe("역할 생성/조회/수정/삭제", () => {
    it("역할 생성 성공", async () => {
      // TODO 구현 예정
    });

    it("역할 조회 성공", async () => {
      // TODO 구현 예정
    });

    it("역할 수정 성공", async () => {
      // TODO 구현 예정
    });

    it("역할 삭제 성공", async () => {
      // TODO 구현 예정
    });
  });
});
