import { Injectable } from "@nestjs/common";
import { RolesRepository } from "../../domains/roles/roles.repository";
import { RoleEntity } from "../../domains/roles/entities/role.entity";

@Injectable()
export class RoleFactory {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async createTestRole() {
    const role = new RoleEntity();
    role.roleName = "관리자";
    return await this.rolesRepository.save(role);
  }
}
