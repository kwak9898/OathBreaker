import { UsersService } from "./users.service";
import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../../enum/role.enum";

@Controller("users")
@Roles(Role.admin)
@ApiTags("USERS")
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 유저 전체 조회
  @Roles(Role.admin)
  @Get("")
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  // 특정 유저 조회
  @Get(":userId")
  async getUserById(@Param("userId") userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  // 특정 유저 수정
  @Patch(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body() user: User
  ): Promise<User> {
    return this.usersService.updateUser(userId, user);
  }

  // 특정 유저 삭제
  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }
}
