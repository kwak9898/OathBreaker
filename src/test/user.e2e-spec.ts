import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
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
  let databaseSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    databaseSource = new DataSource({
      type: "postgres",
      host: "127.0.0.1",
      username: "kwaktaemin",
      password: "ian123@",
      database: "test_data",
      port: 5432,
      entities: [User],
    });
    await databaseSource.initialize();
    await databaseSource.synchronize(true);
  });

  afterAll(async () => {
    await databaseSource.dropDatabase();
    await databaseSource.destroy();
  });

  describe("회원가입 테스트", () => {
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
