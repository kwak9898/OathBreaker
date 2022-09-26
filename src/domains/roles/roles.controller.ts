import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RolesService } from "./roles.service";
import { User } from "../users/entities/user.entity";
import { RolesDto } from "./dto/roles.dto";

@Controller("roles")
export class RolesController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  // 유저 역할 조회
  @Get("/create/:userId/:roleName")
  getRoleByUser(
    @Param("userId") userId: string,
    @Param("roleName") roleName: string
  ): Promise<User> {
    return this.rolesService.getRoleByUser(userId, roleName);
  }

  // 유저 역할 수정
  @Patch("/update/:userId")
  updateRoleBYUser(
    @Param("userId") userId: string,
    @Body() dto: RolesDto
  ): Promise<User> {
    return this.rolesService.updateRoleByUser(userId, dto.roleName);
  }

  // 유저 역할 삭제
  @Delete("/delete/:userId")
  deleteRoleByUser(
    @Param("userId") userId: string,
    @Query("role") roleName: RolesDto
  ): Promise<void> {
    return this.rolesService.deleteRoleByUser(userId, roleName.roleName);
  }
}
