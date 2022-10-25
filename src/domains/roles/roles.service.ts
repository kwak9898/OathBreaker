import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesRepository } from "./roles.repository";
import { RoleEntity } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private roleRepository: RolesRepository
  ) {}

  // 역할 전체 조회
  // 역할 전체 조회
  async getAllRoles(
    options: MyPaginationQuery
  ): Promise<Pagination<RoleEntity>> {
    return paginate(this.roleRepository, options);
  }

  // 역할 생성
  createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleRepository.createRole(createRoleDto);
  }

  // 역할 수정
  updateRole(roleId: number, role: RoleEntity): Promise<RoleEntity> {
    return this.roleRepository.updateRole(roleId, role);
  }

  // 역할 삭제
  deleteRole(roleId: number): Promise<void> {
    return this.roleRepository.deleteRole(roleId);
  }
}
