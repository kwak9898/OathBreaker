import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { RoleRepository } from "../../repositories/role.repository";
import { Roles } from "../../enum/roles.enum";

@Injectable()
export class RolesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository
  ) {}

  // 유저 역할 생성
  getRoleByUser(userId: string, roleName: string): Promise<User> {
    return this.roleRepository.getRoleByUser(userId, roleName);
  }

  // 유저 역할 수정
  updateRoleByUser(userId: string, role: Roles): Promise<User> {
    return this.roleRepository.updateRoleByUser(userId, role);
  }

  // 유저 역할 삭제
  deleteRoleByUser(userId: string, roleName: string): Promise<void> {
    return this.roleRepository.deleteRoleByUser(userId, roleName);
  }
}
