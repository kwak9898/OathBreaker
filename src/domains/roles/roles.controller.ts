import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesGuard } from "../../guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoleEntity } from "./entities/role.entity";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "./enum/role.enum";
import { CreateRoleDto } from "./dto/create-role.dto";

@Controller("roles")
@UseGuards(RolesGuard)
@ApiTags("ROLES")
@ApiBearerAuth("access-token")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  /**
   * 역할 전체 조회
   */
  @Roles(Role.admin)
  @Get("")
  getAllRoles(): Promise<RoleEntity[]> {
    return this.rolesService.getAllRoles();
  }

  /**
   * 역할 생성
   */
  @Roles(Role.admin)
  @Post("create")
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRoleDto);
  }

  /**
   * 역할 수정
   */
  @Roles(Role.admin)
  @Patch(":roleId")
  async updateRole(
    @Param("roleId") roleId: number,
    @Body() role: RoleEntity
  ): Promise<RoleEntity> {
    return await this.rolesService.updateRole(roleId, role);
  }

  /**
   * 역할 삭제
   */
  @Roles(Role.admin)
  @Delete(":roleId")
  deleteRole(@Param("roleId") roleId: number): Promise<void> {
    return this.rolesService.deleteRole(roleId);
  }
}
