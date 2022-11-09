import { Injectable } from "@nestjs/common";
import { User } from "../../domains/users/entities/user.entity";
import { UserRepository } from "../../domains/users/user.repository";
import { Role } from "../../domains/roles/enum/role.enum";
import { AuthService } from "../../domains/auth/auth.service";
import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";

@Injectable()
export class AuthFactory {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) {}

  async createTestToken() {
    const user = new User();
    user.userId = "user12345";
    user.username = "testerAdmin";
    user.password = await hash("password123@", 12);
    user.team = "운영";
    user.roleName = Role.admin;
    return this.authService.createAccessToken(
      (await this.userRepository.save(user)).userId
    );
  }

  async createTestRefreshToken() {
    const user = new User();
    user.userId = "user12345";
    user.username = "testerAdmin";
    user.password = "password123@";
    user.team = "운영";
    user.roleName = Role.admin;
    return this.authService.createRefreshToken(
      (await this.userRepository.save(user)).userId
    );
  }

  async createManagerToken() {
    const user = new User();
    user.userId = faker.internet.email();
    user.username = faker.name.middleName();
    user.password = await hash("password123@", 12);
    user.team = faker.company.name();
    user.roleName = Role.manager;
    return this.authService.createRefreshToken(
      (await this.userRepository.save(user)).userId
    );
  }
}
