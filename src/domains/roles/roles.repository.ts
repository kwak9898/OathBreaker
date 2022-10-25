import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RoleEntity } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesRepository extends Repository<RoleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }

  // 역할 전체 조회
  async getAllRoles(): Promise<RoleEntity[]> {
    const roles = await this.find();

    if (!roles) {
      throw new NotFoundException("역할들이 존재하지 않습니다.");
    }

    return roles;
  }

  // 역할 생성
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { roleName } = createRoleDto;

    const role = await this.create({ roleName });

    const existRole = await this.findOne({ where: { roleName } });

    if (existRole !== null) {
      throw new NotFoundException("이미 존재하는 역할입니다.");
    }

    const saveRole = await this.save(role);
    return saveRole;
  }

  // 역할 수정
  async updateRole(id: number, role: RoleEntity): Promise<RoleEntity> {
    role.updatedAt = new Date();
    const roleId = await this.findOne({ where: { roleId: id } });

    if (!roleId) {
      throw new NotFoundException("존재하지 않는 역할입니다.");
    }

    const updateRole = await this.save(role);
    return updateRole;
  }

  // 역할 삭제
  async deleteRole(id: number): Promise<void> {
    const existRole = await this.delete(id);

    if (!existRole) {
      throw new NotFoundException("삭제할 역할이 없습니다.");
    }
  }
}
