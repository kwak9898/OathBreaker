import { Test, TestingModule } from "@nestjs/testing";
import { getConnection } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { UsersService } from "../src/models/users/users.service";
import { User } from "../src/database/entities/user.entity";
import { AuthService } from "../src/models/auth/auth.service";
import { RolesService } from "../src/models/roles/roles.service";
import * as request from "supertest";

describe("유저 테스트", () => {
  let app: INestApplication;
  let usersRepository: User;
  let usersService: UsersService;
  let authService: AuthService;
  let rolesService: RolesService;
  let date: Date;
  let token;
  const domain = "localhost:3000";

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().dropDatabase();
    await getConnection().synchronize(true);
  });
  describe("회원가입 테스트", async () => {
    it("회원가입 성공", async () => {
      const { body } = await request(app.getHttpServer()).post(
        `${domain}/user`
      );
      expect(body).toEqual(HttpStatus.OK);
    });

    it("회원가입 시 비밀번호를 적지 않았을 때", async () => {
      const { body } = await request(
        app.getHttpServer().post(`${domain}/user`)
      );
    });
  });
});
