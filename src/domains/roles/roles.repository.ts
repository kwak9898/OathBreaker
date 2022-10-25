import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RoleEntity } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesRepository extends Repository<RoleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
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
  async updateRole(roleId: number, role: RoleEntity): Promise<RoleEntity> {
    role.updatedAt = new Date();
    const existRole = await this.findOne({ where: { roleId } });

    if (!existRole) {
      throw new NotFoundException("존재하지 않는 역할 입니다.");
    }

    await this.update(roleId, { roleName: role.roleName });
    return existRole;
  }

  // 역할 삭제
  async deleteRole(roleId: number): Promise<void> {
    const existRole = await this.delete(roleId);

    if (!existRole) {
      throw new NotFoundException("삭제할 역할이 없습니다.");
    }
  }
}
