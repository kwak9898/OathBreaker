import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesRepository } from "./roles.repository";
import { RoleEntity } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { ROLE_EXCEPTION } from "../../exception/error-code";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private roleRepository: RolesRepository
  ) {}

  // 역할 전체 조회
  async getAllRoles(
    options: MyPaginationQuery
  ): Promise<Pagination<RoleEntity>> {
    return paginate(await this.roleRepository, options);
  }

  // 역할 생성
  createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleRepository.createRole(createRoleDto);
  }

  // 역할 수정
  async updateRole(roleId: number, roleName: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { roleId } });

    if (!role) {
      throw new NotFoundException(ROLE_EXCEPTION.ROLE_NOT_FOUND);
    }

    role.roleName = roleName;
    role.updatedAt = new Date();

    return this.roleRepository.save(role);
  }

  // 역할 삭제
  deleteRole(roleId: number): Promise<void> {
    return this.roleRepository.deleteRole(roleId);
  }
}
