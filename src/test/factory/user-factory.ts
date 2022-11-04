import { Injectable } from "@nestjs/common";
import { User } from "../../domains/users/entities/user.entity";
import { UserRepository } from "../../domains/users/user.repository";
import { Role } from "../../domains/roles/enum/role.enum";
import * as bcrypt from "bcryptjs";
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
    user.password = "password123@";
    user.team = "운영";
    user.roleName = Role.manager;
    return this.repository.save(user);
  }

  async createTestUser() {
    const user = new User();
    user.userId = "testuser123";
    user.username = "tester";
    user.password = await bcrypt.hash("password123@", 12);
    user.team = "운영";
    user.roleName = Role.manager;
    return this.repository.save(user);
  }

  async createBaseUserList() {
    const userList = [];
    const user = new User();
    user.userId = faker.name.fullName();
    user.username = faker.name.middleName();
    user.password = await bcrypt.hash("password123@", 12);
    user.team = faker.color.human();
    user.roleName = faker.company.name();

    for (let i = 0; i < 17; i++) {
      userList.push(this.repository.save(user));
    }

    return userList;
  }
}
