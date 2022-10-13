import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RolesService } from "./roles.service";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "./enum/role.enum";
import { ApiTags } from "@nestjs/swagger";
import { User } from "../users/entities/user.entity";
import { RolesDto } from "./dto/roles.dto";

@Controller("roles")
@UseGuards(RolesGuard)
@ApiTags("ROLES")
export class RolesController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  /**
   * 역할 전체 조회
   */
  @Roles(Role.admin)
  @Get()
  getRoleByUser() {
    return { roles: ["관리자", "등록자"] };
  }

  /**
   * 유저 역할 수정
   */
  @Roles(Role.admin)
  @Patch("/:userId")
  updateRoleByUser(
    @Param("userId") userId: string,
    @Body() roleDto: RolesDto
  ): Promise<User> {
    return this.rolesService.updateRoleByUser(userId, roleDto.roleName);
  }
}
