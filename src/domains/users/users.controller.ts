import { UsersService } from "./users.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
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
import { UrlDto } from "./dto/url.dto";
import { RoleCntDto } from "./dto/role-cnt.dto";
import { UserListRequestDto } from "./dto/user-list-request.dto";
import { ApiPaginatedResponse } from "../../dacorators/paginate.decorator";
import { GetConnectLogDto } from "./dto/get-connect-log.dto";

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
  ): Promise<Pagination<User>> {
    return this.usersService.getAllUsers(
      query,
      userListRequestDto.roleName,
      userListRequestDto.userId
    );
  }

  /**
   * 관리자 or 등록자인 유저 카운트 조회
   */
  @Roles(Role.admin)
  @Get("/roles/count")
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
  @Patch("/access/last-date")
  async updateLastAccessAt(@CurrentUser() user: User) {
    await this.usersService.updateLastAccessAt(user.userId);
  }

  /**
   * 전체 유저 접속 로그 전체 조회
   */
  @Roles(Role.admin)
  @Get("/connect/log")
  @ApiPaginatedResponse(GetConnectLogDto)
  @ApiOperation({
    summary: "전체 유저 접속 로그 전체 조회",
  })
  async getConnectLog(
    @Query() options: MyPaginationQuery
  ): Promise<Pagination<User>> {
    return await this.usersService.getConnectLog(options);
  }

  /**
   * 유저의 최초 접속일 업데이트
   */
  @Patch("/access/first-date")
  @ApiOkResponse({ type: User })
  @ApiOperation({
    summary: "유저의 최조 접속일 업데이트",
  })
  async updateFirstAccessAt(@CurrentUser() user: User) {
    return await this.usersService.updateFirstAccessAt(user.userId);
  }

  /**
   * 유저의 IP주소 저장
   */
  @Patch("/create/ip")
  @ApiOkResponse({ type: User })
  @ApiOperation({
    summary: "유저의 IP주소 저장",
  })
  async createIpByUser(@CurrentUser() user: User, @Ip() ip: string) {
    user.ip = ip;
    return await this.usersService.createIpByUser(user.userId, (user.ip = ip));
  }

  /**
   * 유저의 URL 저장
   */
  @Patch("/create/url")
  @ApiOkResponse({ type: User })
  @ApiOperation({
    summary: "유저의 URL 저장",
  })
  async createUrlByUser(@CurrentUser() user: User, @Body() url: UrlDto) {
    return this.usersService.createUrlByUser(user.userId, url.url);
  }

  /**
   * 유저 접속 로그 삭제
   */
  @Roles(Role.admin)
  @Delete("/log/:userId")
  @ApiOperation({
    summary: "유저 접속 로그 삭제",
  })
  async deleteLogByUser(@Param("userId") userId: string): Promise<User> {
    return this.usersService.deleteLogByUser(userId);
  }
}
