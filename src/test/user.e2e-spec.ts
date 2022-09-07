import { Test, TestingModule } from "@nestjs/testing";
import { getConnection } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { UsersService } from "../models/users/users.service";
import { User } from "../database/entities/user.entity";
import { AuthService } from "../models/auth/auth.service";
import { RolesService } from "../models/roles/roles.service";
import * as request from "supertest";

describe("유저 테스트", () => {
  let app: INestApplication;
  let usersRepository: User;
  let usersService: UsersService;
  let authService: AuthService;
  let rolesService: RolesService;
  let date: Date;
  let userId: string | undefined;
  let password: string | undefined;
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
      userId = "test000";
      password = "test1234@";
      expect(body).toEqual(body["password"]);
    });

    // it("회원가입 시 중복 된 아이디를 적었을 경우", async () => {
    //   const { body } = await request(
    //     app.getHttpServer().post(`${domain}/user`)
    //   );
    //   expect(body).toBeNull(body.password);
    // });
  });
});
