import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { UserFactory } from "./factory/user-factory";
import { DatabaseModule } from "../database/database.module";
import { JwtService } from "@nestjs/jwt";
import { AuthFactory } from "./factory/auth-factory";
import { RolesService } from "../domains/roles/roles.service";
import { RequestHelper } from "../utils/test.utils";
import { RolesRepository } from "../domains/roles/roles.repository";
import { AuthService } from "../domains/auth/auth.service";
import { UsersService } from "../domains/users/users.service";
import { UserRepository } from "../domains/users/user.repository";
import { CreateRoleDto } from "../domains/roles/dto/create-role.dto";
import { RoleFactory } from "./factory/roleFactory";
import { Role } from "../domains/roles/enum/role.enum";
import { ROLE_EXCEPTION } from "../exception/error-code";

describe("역할 생성/조회/수정/삭제 테스트", () => {
  let app: INestApplication;
  let rolesService: RolesService;
  let authService: AuthService;
  let usersService: UsersService;

  let requestHelper: RequestHelper;
  let userFactory: UserFactory;
  let authFactory: AuthFactory;
  let roleFactory: RoleFactory;
  let dataSource: DataSource;

  let token;
  let user;

  const RoleDomain = "/roles";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UserRepository,
        RolesRepository,
        DatabaseModule,
        JwtService,
        AuthService,
        UsersService,
        RolesService,
        AuthFactory,
        UserFactory,
        RoleFactory,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    rolesService = moduleFixture.get(RolesService);
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);

    authFactory = moduleFixture.get(AuthFactory);
    userFactory = moduleFixture.get(UserFactory);
    roleFactory = moduleFixture.get(RoleFactory);

    dataSource = moduleFixture.get(DataSource);
    await dataSource.synchronize(true);

    token = await authFactory.createTestToken();
    user = await userFactory.createManagerUser();

    requestHelper = new RequestHelper(app, token);

    await app.init();
  });

  describe("역할 생성", () => {
    it("성공", async (done) => {
      // Given
      const dto = new CreateRoleDto();
      dto.roleName = Role.manager;

      // When
      const response = await requestHelper.post(`${RoleDomain}`, dto);

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body.roleName).toBe(dto.roleName);
      done();
    });

    it("이미 존재하는 역할을 생성할 경우 실패", async (done) => {
      // Given
      await roleFactory.createTestRole();
      const dto = new CreateRoleDto();
      dto.roleName = Role.admin;

      // When
      const response = await requestHelper.post(`${RoleDomain}`, dto);

      // Then
      const body = response.body;
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(body.code).toBe(ROLE_EXCEPTION.ROLE_EXIST.code);
      expect(body.message).toBe(ROLE_EXCEPTION.ROLE_EXIST.message);
      done();
    });
  });

  describe("역할 조회", () => {
    it("성공", async (done) => {
      // Given
      await roleFactory.createTestRole();

      // When
      const response = await requestHelper.get(`${RoleDomain}?page=1&limit=10`);

      // Then
      const body = response.body;
      const meta = response.body.meta;
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.roleId).not.toBeNull();
      expect(body.roleName).not.toBeNull();
      expect(meta.totalPages).toBe(1);
      expect(meta.itemsPerPage).toBe(10);
      done();
    });
  });
});
