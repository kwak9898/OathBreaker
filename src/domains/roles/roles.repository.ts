import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RoleEntity } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { ROLE_EXCEPTION } from "../../exception/error-code";

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
      throw new BadRequestException(ROLE_EXCEPTION.ROLE_EXIST);
    }

    const saveRole = await this.save(role);
    return saveRole;
  }

  // 역할 삭제
  async deleteRole(roleId: number): Promise<void> {
    const role = await this.findOne({ where: { roleId } });

    if (!role) {
      throw new NotFoundException(ROLE_EXCEPTION.ROLE_NOT_FOUND);
    }
    await this.delete(roleId);
  }
}
