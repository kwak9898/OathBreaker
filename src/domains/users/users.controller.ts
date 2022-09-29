import { UsersService } from "./users.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../../enum/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("users")
@ApiTags("USERS")
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 유저 전체 조회
  @Roles(Role.admin)
  @Get("")
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  // 특정 유저 조회
  @Roles(Role.admin)
  @Get(":userId")
  async getUserById(@Param("userId") userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  // 특정 유저 수정
  @Roles(Role.admin)
  @Patch(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body() user: User
  ): Promise<User> {
    return this.usersService.updateUser(userId, user);
  }

  // 특정 유저 삭제
  @Roles(Role.admin)
  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }
}
