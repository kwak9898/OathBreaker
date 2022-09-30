import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RolesService } from "./roles.service";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "./enum/role.enum";
import { ApiTags } from "@nestjs/swagger";

@Controller("roles")
@UseGuards(RolesGuard)
@ApiTags("ROLES")
export class RolesController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  // 유저 역할 전체 조회
  @Roles(Role.admin)
  @Get()
  getRoleByUser() {
    return { roles: ["관리자", "등록자"] };
  }

  // // 유저 역할 수정
  // @Roles(Role.admin)
  // @Patch("/update/:userId")
  // updateRoleBYUser(
  //   @Param("userId") userId: string,
  //   @Body() dto: RolesDto
  // ): Promise<User> {
  //   return this.rolesService.updateRoleByUser(userId, dto.roleName);
  // }
  //
  // // 유저 역할 삭제
  // @Roles(Role.admin)
  // @Delete("/delete/:userId")
  // deleteRoleByUser(
  //   @Param("userId") userId: string,
  //   @Query("role") roleName: RolesDto
  // ): Promise<void> {
  //   return this.rolesService.deleteRoleByUser(userId, roleName.roleName);
  // }
}
