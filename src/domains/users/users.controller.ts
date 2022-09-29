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
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../roles/enum/role.enum";
import { RolesGuard } from "../../guards/roles.guard";
import { CurrentUser } from "../../dacorators/current-user.decorators";

@Controller("users")
@ApiTags("USERS")
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * 유저 전체 조회
   */
  @Roles(Role.admin)
  @Get("")
  @ApiOkResponse({ type: User, isArray: true })
  @ApiOperation({
    summary: "유저 전체 조회",
  })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  /**
   * 특정 유저 조회
   */
  @Roles(Role.admin)
  @Get(":userId")
  @ApiOkResponse({ type: User })
  @ApiOperation({
    summary: "특정 유저 조회",
  })
  async getUserById(@Param("userId") userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  /**
   * 유저 수정
   */
  @Roles(Role.admin)
  @Patch(":userId")
  @ApiOkResponse({ type: User })
  @ApiOperation({
    summary: "유저 수정",
  })
  async updateUser(
    @Param("userId") userId: string,
    @Body() user: User
  ): Promise<User> {
    return this.usersService.updateUser(userId, user);
  }

  /**
   * 유저 삭제
   */
  @Roles(Role.admin)
  @ApiOperation({
    summary: "유저 삭제",
  })
  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }

  /**
   * 유저 최종 접속일 업데이트
   */
  @Patch("/access/last-user")
  async updateLastAccessAt(@CurrentUser() user: User) {
    await this.usersService.updateLastAccessAt(user.userId);
  }
}
