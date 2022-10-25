import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesRepository } from "./roles.repository";
import { RoleEntity } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private roleRepository: RolesRepository
  ) {}

  // 역할 전체 조회
  getAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepository.getAllRoles();
  }

  // 역할 생성
  createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleRepository.createRole(createRoleDto);
  }

  // 역할 수정
  updateRole(id: number, role: RoleEntity): Promise<RoleEntity> {
    return this.roleRepository.updateRole(id, role);
  }

  // 역할 삭제
  deleteRole(id: number): Promise<void> {
    return this.roleRepository.deleteRole(id);
  }
}
