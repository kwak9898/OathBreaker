import { Injectable } from "@nestjs/common";
import { User } from "../../domains/users/entities/user.entity";
import { UserRepository } from "../../domains/users/user.repository";

@Injectable()
export class UserFactory {
  constructor(private readonly repository: UserRepository) {}

  createBaseUser() {
    const user = new User();
    user.userId = "user12345";
    user.password = "password123@";
    user.isActive = true;
    user.roleName = "관리자";
    return this.repository.save(user);
  }
}
