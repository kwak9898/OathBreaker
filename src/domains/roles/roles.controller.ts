import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RolesService } from "./roles.service";
import { User } from "../users/entities/user.entity";
import { RolesDto } from "./dto/roles.dto";
import { UserDto } from "../users/dto/user.dto";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "./enum/role.enum";
import { GetUser } from "../../dacorators/get-user.decorator";

@Controller("roles")
@UseGuards(RolesGuard)
export class RolesController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  // 유저 역할 전체 조회
  @Roles(Role.admin)
  @Get()
  getRoleByUser(@GetUser() user: UserDto): Promise<User[]> {
    return this.rolesService.getAllByRole(user);
  }

  // 유저 역할 수정
  @Roles(Role.admin)
  @Patch("/update/:userId")
  updateRoleBYUser(
    @Param("userId") userId: string,
    @Body() dto: RolesDto
  ): Promise<User> {
    return this.rolesService.updateRoleByUser(userId, dto.roleName);
  }

  // 유저 역할 삭제
  @Roles(Role.admin)
  @Delete("/delete/:userId")
  deleteRoleByUser(
    @Param("userId") userId: string,
    @Query("role") roleName: RolesDto
  ): Promise<void> {
    return this.rolesService.deleteRoleByUser(userId, roleName.roleName);
  }
}
