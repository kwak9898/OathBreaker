import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { ConnectLogsService } from "../domains/connect-logs/connect-logs.service";
import { RequestHelper } from "../utils/test.utils";
import { AuthFactory } from "./factory/auth-factory";
import { ConnectLogsRepository } from "../domains/connect-logs/connect-logs.repository";
import { DatabaseModule } from "../database/database.module";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../domains/auth/auth.service";
import { UserRepository } from "../domains/users/user.repository";
import { UsersService } from "../domains/users/users.service";
import { ConnectLogFactory } from "./factory/connectLogFactory";
import { UrlDto } from "../domains/connect-logs/dto/url.dto";
import { UserFactory } from "./factory/user-factory";
import { CONNECT_LOG_EXCEPTION } from "../exception/error-code";

describe("접속 로그 생성/조회/삭제 테스트", () => {
  let app: INestApplication;
  let authService: AuthService;
  let connectLogsService: ConnectLogsService;
  let usersService: UsersService;

  let requestHelper: RequestHelper;
  let authFactory: AuthFactory;
  let connectLogFactory: ConnectLogFactory;
  let userFactory: UserFactory;
  let dataSource: DataSource;

  let logId: number | undefined;
  let url: string | undefined;
  let ip: string | undefined;
  let accessAt: Date | undefined;

  let token;
  let connectLog;

  const LogsDomain = "/connect-logs";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        ConnectLogsRepository,
        UserRepository,
        DatabaseModule,
        UsersService,
        AuthService,
        ConnectLogsService,
        JwtService,
        AuthFactory,
        ConnectLogFactory,
        UserFactory,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    connectLogsService = moduleFixture.get(ConnectLogsService);
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);

    authFactory = moduleFixture.get(AuthFactory);
    connectLogFactory = moduleFixture.get(ConnectLogFactory);
    userFactory = moduleFixture.get(UserFactory);

    dataSource = moduleFixture.get(DataSource);
    await dataSource.synchronize(true);

    token = await authFactory.createTestToken();
    connectLog = await connectLogFactory.createBaseLog();

    requestHelper = new RequestHelper(app, token);

    await app.init();
  });

  describe("접속 로그 생성", () => {
    it("성공", async () => {
      // Given
      const testUser = await userFactory.createUser();

      const dto = new UrlDto();
      dto.url = "https://www.google.com";

      // When
      const response = await requestHelper.post(`${LogsDomain}`, dto);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.url).toBe(dto.url);
      expect(body.ip).not.toBeNull();
      expect(body.userId).toBe(testUser.userId);
      expect(body.userName).toBe(testUser.username);
      expect(body.accessAt).not.toBeNull();
    });

    it("토큰이 없을 시 실패", async () => {
      // Given
      const nullToken = null;
      const req = new RequestHelper(app, nullToken);

      const dto = new UrlDto();
      dto.url = "https://www.naver.com";

      // When
      const response = await req.post(`${LogsDomain}`, dto);

      // Then
      const body = response.body;
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(body.message).toBe("Unauthorized");
    });
  });

  describe("접속 로그 조회", () => {
    it("성공", async () => {
      // Given
      await connectLogFactory.createBaseLogList();

      // When
      const response = await requestHelper.get(
        `${LogsDomain}/?page=1&limit=10`
      );

      // Then
      const items = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(items).not.toBeNull();
      expect(meta.totalPages).toBe(2);
      expect(meta.itemsPerPage).toBe(10);
    });
  });

  describe("접속 로그 삭제", () => {
    it("성공", async () => {
      // Given
      logId = (await connectLogFactory.createBaseLog()).logId;

      // When
      const response = await requestHelper.delete(`${LogsDomain}/${logId}`);

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it("접속 로그의 ID가 없을 경우 실패", async () => {
      // Given

      // LogId
      logId = 0;

      // When
      const response = await requestHelper.delete(`${LogsDomain}/${logId}`);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.code).toBe(CONNECT_LOG_EXCEPTION.CONNECT_LOG_NOT_FOUND.code);
      expect(body.message).toBe(
        CONNECT_LOG_EXCEPTION.CONNECT_LOG_NOT_FOUND.message
      );
    });
  });
});
