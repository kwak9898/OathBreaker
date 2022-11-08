import { Injectable } from "@nestjs/common";
import { Role } from "../../domains/roles/enum/role.enum";
import { faker } from "@faker-js/faker";
import { RoleEntity } from "../../domains/roles/entities/role.entity";
import { RolesRepository } from "../../domains/roles/roles.repository";

@Injectable()
export class RoleFactory {
  constructor(private readonly repository: RolesRepository) {}

  createBaseRole() {
    const role = new RoleEntity();
    role.roleName = Role.admin;
    return this.repository.save(role);
  }

  async createManagerRole() {
    const role = new RoleEntity();
    role.roleName = Role.manager;
    return this.repository.save(role);
  }

  async createTestRole(role?: RoleEntity) {
    role = new RoleEntity();
    role.roleName = faker.name.jobType();
    return this.repository.save(role);
  }

  async createRoleList() {
    const role = new RoleEntity();
    role.roleName = faker.name.jobType();

    const roles = [];
    const createRole = await this.repository.save(role);
    for (let i = 0; i < 15; i++) {
      roles.push(await this.createTestRole(createRole));
    }
    return createRole;
  }
}
