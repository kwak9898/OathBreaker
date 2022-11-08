import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { AuthService } from "../domains/auth/auth.service";
import { DatabaseModule } from "../database/database.module";
import { JwtService } from "@nestjs/jwt";
import { AuthFactory } from "./factory/auth-factory";
import { RequestHelper } from "../utils/test.utils";
import { RoleFactory } from "./factory/roleFactory";
import { RolesRepository } from "../domains/roles/roles.repository";
import { RolesService } from "../domains/roles/roles.service";
import { ROLE_EXCEPTION } from "../exception/error-code";
import { UsersService } from "../domains/users/users.service";
import { UserRepository } from "../domains/users/user.repository";
import { Role } from "../domains/roles/enum/role.enum";
import { UserFactory } from "./factory/user-factory";
import { CreateRoleDto } from "../domains/roles/dto/create-role.dto";
import { UpdateRoleDto } from "../domains/roles/dto/updateRole.dto";

describe("역할 생성/조회/수정/삭제 테스트", () => {
  let app: INestApplication;
  let authService: AuthService;
  let usersService: UsersService;
  let rolesService: RolesService;

  let requestHelper: RequestHelper;
  let authFactory: AuthFactory;
  let userFactory: UserFactory;
  let roleFactory: RoleFactory;
  let dataSource: DataSource;

  let roleId: number | undefined;
  let roleName: string | undefined;

  let token;
  let role;

  const RolesDomain = "/roles";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        RolesRepository,
        UserRepository,
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
    authService = moduleFixture.get(AuthService);
    usersService = moduleFixture.get(UsersService);
    rolesService = moduleFixture.get(RolesService);

    authFactory = moduleFixture.get(AuthFactory);
    userFactory = moduleFixture.get(UserFactory);
    roleFactory = moduleFixture.get(RoleFactory);

    dataSource = moduleFixture.get(DataSource);
    await dataSource.synchronize(true);

    token = await authFactory.createTestToken();
    role = await roleFactory.createBaseRole();

    requestHelper = new RequestHelper(app, token);

    await app.init();
  });

  describe("역할 생성", () => {
    it("성공", async () => {
      // Given
      const dto = new CreateRoleDto();
      dto.roleName = "oneRoles";

      // When
      const response = await requestHelper.post(`${RolesDomain}`, dto);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.roleName).toBe(dto.roleName);
      expect(body.deletedAt).toBeNull();
      expect(body.createdAt).not.toBeNull();
      expect(body.updatedAt).not.toBeNull();
      expect(body.roleId).not.toBeNull();
    });

    it("이미 존재할 역할인 경우 실패", async () => {
      // Given
      roleName = Role.admin;

      // When
      const response = await requestHelper.post(`${RolesDomain}`, roleName);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(body.code).toBe(ROLE_EXCEPTION.ROLE_EXIST.code);
      expect(body.message).toBe(ROLE_EXCEPTION.ROLE_EXIST.message);
    });
  });

  describe("역할 전체 조회", () => {
    it("성공", async () => {
      // Given
      await roleFactory.createRoleList();

      // When
      const response = await requestHelper.get(
        `${RolesDomain}?page=1&limit=10`
      );

      // Then
      const item = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(item).not.toBeNull();
      expect(meta.totalPages).toBe(2);
      expect(meta.itemsPerPage).toBe(10);
    });

    it("특정 역할 전체 조회", async () => {
      // Given
      roleName = encodeURI(role.roleName);

      // When
      const response = await requestHelper.get(
        `${RolesDomain}?page=1&limit=10&roleName=${roleName}`
      );

      // Then
      const item = response.body.items[0];
      const meta = response.body.meta;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(item.roleName).toBe(Role.admin);
      expect(item.roleId).not.toBeNull();
      expect(meta.itemsPerPage).toBe(10);
    });
  });

  describe("역할 수정", () => {
    it("성공", async () => {
      // Given
      const managerRole = await roleFactory.createManagerRole();

      const dto = new UpdateRoleDto();
      roleId = managerRole.roleId;
      dto.roleName = "update";

      // When
      const response = await requestHelper.patch(
        `${RolesDomain}/${roleId}`,
        dto
      );

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(body.roleId).toBe(roleId);
      expect(body.roleName).toBe(dto.roleName);
      expect(body.createdAt).not.toBeNull();
      expect(body.updatedAt).not.toBeNull();
      expect(body.deletedAt).toBeNull();
    });

    it("존재하지 않는 roleId로 수정 시도할 시 실패", async () => {
      // Given
      const dto = new UpdateRoleDto();
      roleId = 798430;
      dto.roleName = "Fail";

      // When
      const response = await requestHelper.patch(
        `${RolesDomain}/${roleId}`,
        dto
      );

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.code).toBe(ROLE_EXCEPTION.ROLE_NOT_FOUND.code);
      expect(body.message).toBe(ROLE_EXCEPTION.ROLE_NOT_FOUND.message);
    });
  });

  describe("역할 삭제", () => {
    it("성공", async () => {
      // Given
      const managerRole = await roleFactory.createManagerRole();
      roleId = managerRole.roleId;

      // When
      const response = await requestHelper.delete(`${RolesDomain}/${roleId}`);

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it("존재하지 않는 roleId를 삭제할 경우 실패", async () => {
      // Given
      roleId = 77777;

      // When
      const response = await requestHelper.delete(`${RolesDomain}/${roleId}`);

      // Then
      const body = response.body;

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.code).toBe(ROLE_EXCEPTION.ROLE_NOT_FOUND.code);
      expect(body.message).toBe(ROLE_EXCEPTION.ROLE_NOT_FOUND.message);
    });
  });
});
