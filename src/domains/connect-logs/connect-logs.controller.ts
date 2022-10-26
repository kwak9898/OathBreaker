import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../../guards/roles.guard";
import { ConnectLogsService } from "./connect-logs.service";
import { Role } from "../roles/enum/role.enum";
import { Roles } from "../../dacorators/role.decorator";
import { MyPaginationQuery } from "../base/pagination-query";
import { Pagination } from "nestjs-typeorm-paginate";
import { ConnectLog } from "./entities/connect-log.entity";
import { User } from "../users/entities/user.entity";
import { UpdateLogDto } from "./dto/update-log.dto";
import { UrlDto } from "./dto/url.dto";
import { CurrentUser } from "../../dacorators/current-user.decorators";

@Controller("connect-logs")
@ApiTags("LOG")
@UseGuards(RolesGuard)
@ApiBearerAuth("access-token")
export class ConnectLogsController {
  constructor(private logsService: ConnectLogsService) {}

  /**
   * 접속 로그 전체 조회
   */
  @Roles(Role.admin)
  @Get("")
  getAllLogs(
    @Query() user: User,
    @Query() query: MyPaginationQuery
  ): Promise<Pagination<ConnectLog>> {
    return this.logsService.getAllLogs(user, query);
  }

  /**
   * 접속 로그 생성
   */
  @Post("/create")
  async createLog(
    logId: number,
    @Body() url: UrlDto,
    @Ip() ip: string,
    @CurrentUser() user: User
  ): Promise<ConnectLog> {
    console.log(user);
    return this.logsService.createLog(logId, url.url, ip, user);
  }

  /**
   * 접속 로그 수정
   */
  @Roles(Role.admin)
  @Patch("/:logId")
  updateLog(
    @Param("logId") logId: number,
    user: User,
    updateLogDto: UpdateLogDto
  ): Promise<ConnectLog> {
    return this.logsService.updateLog(logId, user, updateLogDto);
  }

  /**
   * 접속 로그 삭제
   */
  @Roles(Role.admin)
  @Delete("/:logId")
  deleteLog(@Param("logId") logId: number): Promise<void> {
    return this.logsService.deleteLog(logId);
  }
}
