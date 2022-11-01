import { UsersService } from "./users.service";
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../roles/enum/role.enum";
import { RolesGuard } from "../../guards/roles.guard";
import { CurrentUser } from "../../dacorators/current-user.decorators";
import { Pagination } from "nestjs-typeorm-paginate";
import { MyPaginationQuery } from "../base/pagination-query";
import { ApiPaginatedResponse } from "../../dacorators/paginate.decorator";
import { UserListRequestDto } from "./dto/user-list-request.dto";
import { RoleCntDto } from "./dto/role-cnt.dto";
import { UserListResponseDto } from "./dto/UserListResponse.dto";

@Controller("users")
@ApiTags("USERS")
@UseGuards(RolesGuard)
@ApiBearerAuth("access-token")
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * 유저 전체 조회
   */
  @Roles(Role.admin)
  @Get("")
  @ApiPaginatedResponse(User)
  @ApiOperation({
    summary: "유저 전체 조회",
  })
  async getAllUsers(
    @Query() query: MyPaginationQuery,
    @Query() userListRequestDto: UserListRequestDto
  ): Promise<Pagination<UserListResponseDto>> {
    return this.usersService.getAllUsers(
      query,
      userListRequestDto.roleName,
      userListRequestDto.userId,
      userListRequestDto.username
    );
  }

  /**
   * 관리자 or 등록자인 유저 카운트 조회
   */
  @Roles(Role.admin)
  @Get("/roles/count")
  @ApiOperation({
    summary: "관리자 or 등록자인 유저 카운트 조회",
  })
  async getAllByRoleCnt(): Promise<RoleCntDto> {
    const adminCnt = await this.usersService.getAllByAdminCnt();
    const registerCnt = await this.usersService.getAllByManagerCnt();
    return new RoleCntDto(adminCnt, registerCnt);
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
    return this.usersService.findOneByUser(userId);
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
  @Patch("/access/last-date")
  async updateLastAccessAt(@CurrentUser() user: User) {
    return await this.usersService.updateLastAccessAt(user.userId);
  }
}
