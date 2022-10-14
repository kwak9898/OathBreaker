import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { RoleRepository } from "./role.repository";

@Injectable()
export class RolesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository
  ) {}

  // 유저 역할 전체 조회
  getAllByRole(): Promise<User[]> {
    return this.roleRepository.getAllByRole();
  }

  // 유저 역할 수정
  updateRoleByUser(userId: string, roleName: string): Promise<User> {
    return this.roleRepository.updateRoleByUser(userId, roleName);
  }
}
