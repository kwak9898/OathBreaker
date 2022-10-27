import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Ip,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { RolesGuard } from "../../guards/roles.guard";
import { ConnectLogsService } from "./connect-logs.service";
import { Role } from "../roles/enum/role.enum";
import { Roles } from "../../dacorators/role.decorator";
import { MyPaginationQuery } from "../base/pagination-query";
import { Pagination } from "nestjs-typeorm-paginate";
import { ConnectLog } from "./entities/connect-log.entity";
import { User } from "../users/entities/user.entity";
import { UrlDto } from "./dto/url.dto";
import { CurrentUser } from "../../dacorators/current-user.decorators";
import { ConnectLogListResponseDto } from "./dto/connect-log-list-response.dto";
import { ApiPaginatedResponse } from "../../dacorators/paginate.decorator";

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
  @ApiPaginatedResponse(ConnectLogListResponseDto)
  @ApiOperation({
    summary: "접속 로그 전체 조회",
  })
  getAllLogs(
    @Query() query: MyPaginationQuery
  ): Promise<Pagination<ConnectLogListResponseDto>> {
    return this.logsService.getAllLogs(query);
  }

  /**
   * 접속 로그 생성
   */
  @Post("")
  @ApiOkResponse({ type: ConnectLog })
  @ApiOperation({
    summary: "접속 로그 생성",
  })
  @HttpCode(200)
  async createLog(
    @Body() url: UrlDto,
    @Ip() ip: string,
    @CurrentUser() user: User
  ): Promise<ConnectLog> {
    return this.logsService.createLog(url.url, ip, user);
  }

  /**
   * 접속 로그 삭제
   */
  @Roles(Role.admin)
  @Delete("/:logId")
  @ApiOperation({
    summary: "접속 로그 삭제",
  })
  deleteLog(@Param("logId") logId: number): Promise<void> {
    return this.logsService.deleteLog(logId);
  }
}
