import { Injectable } from "@nestjs/common";
import { User } from "../../domains/users/entities/user.entity";
import { UserRepository } from "../../domains/users/user.repository";
import { Role } from "../../domains/roles/enum/role.enum";
import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";

@Injectable()
export class UserFactory {
  constructor(private readonly repository: UserRepository) {}

  createBaseUser() {
    const user = new User();
    user.userId = "user12345";
    user.username = "testerAdmin";
    user.password = "password123@";
    user.team = "운영";
    user.roleName = Role.admin;
    return this.repository.save(user);
  }

  async createManagerUser() {
    const user = new User();
    user.userId = "manager1";
    user.username = "testManager";
    user.password = await hash("password123@", 12);
    user.team = "운영";
    user.roleName = Role.manager;
    return this.repository.save(user);
  }

  async createTestUser(user?: User) {
    user = new User();
    user.userId = faker.internet.email();
    user.username = faker.internet.userName();
    user.password = await hash("test123!@#", 12);
    user.team = faker.company.name();
    user.roleName = Role.manager;
    return this.repository.save(user);
  }

  async createUserList() {
    const user = new User();
    user.userId = faker.internet.email();
    user.username = faker.internet.userName();
    user.password = await hash("test123!@#", 12);
    user.team = faker.company.name();
    user.roleName = Role.manager;

    const users = [];
    const createUser = await this.repository.save(user);
    for (let i = 0; i < 15; i++) {
      users.push(await this.createTestUser(createUser));
    }
    return createUser;
  }
}
