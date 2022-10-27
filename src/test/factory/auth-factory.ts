import { Injectable } from "@nestjs/common";
import { User } from "../../domains/users/entities/user.entity";
import { UserRepository } from "../../domains/users/user.repository";
import { Role } from "../../domains/roles/enum/role.enum";
import { AuthService } from "../../domains/auth/auth.service";

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
    user.password = "password123@";
    user.team = "운영";
    user.roleName = Role.admin;
    return this.authService.createAccessToken(
      (await this.userRepository.save(user)).userId
    );
  }
}
