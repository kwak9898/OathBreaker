import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RolesService } from "./roles.service";
import { User } from "../users/entities/user.entity";
import { Roles } from "../../enum/roles.enum";

@Controller("roles")
export class RolesController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  // 유저 역할 조회
  @Post("/create/:userId")
  getRoleByUser(
    @Param("userId") userId: string,
    @Body() roleName: string
  ): Promise<User> {
    return this.rolesService.getRoleByUser(userId, roleName);
  }

  // 유저 역할 수정
  @Patch("/update/:userId")
  updateRoleBYUser(
    @Param("userId") userId: string,
    @Body() role: Roles
  ): Promise<User> {
    return this.rolesService.updateRoleByUser(userId, role);
  }

  // 유저 역할 삭제
  @Delete("/delete/:userId")
  deleteRoleByUser(
    @Param("userId") userId: string,
    roleName: string
  ): Promise<void> {
    return this.rolesService.deleteRoleByUser(userId, roleName);
  }
}
