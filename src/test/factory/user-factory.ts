import { Injectable } from "@nestjs/common";
import { User } from "../../domains/users/entities/user.entity";
import { UserRepository } from "../../domains/users/user.repository";
import { Role } from "../../domains/roles/enum/role.enum";

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

  createManagerUser() {
    const user = new User();
    user.userId = "manager1";
    user.username = "testManager";
    user.password = "password123@";
    user.team = "운영";
    user.roleName = Role.choose;
    return this.repository.save(user);
  }
}
