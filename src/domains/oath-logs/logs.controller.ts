import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../../guards/roles.guard";
import { LogsService } from "./logs.service";
import { Role } from "../roles/enum/role.enum";
import { Roles } from "../../dacorators/role.decorator";
import { MyPaginationQuery } from "../base/pagination-query";
import { Pagination } from "nestjs-typeorm-paginate";
import { ConnectLog } from "./entities/log.entity";
import { User } from "../users/entities/user.entity";
import { UpdateLogDto } from "./dto/update-log.dto";

@Controller("oath-logs")
@ApiTags("LOG")
@UseGuards(RolesGuard)
@ApiBearerAuth("access-token")
export class LogsController {
  constructor(private logsService: LogsService) {}

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
  // @Roles(Role.admin)
  // @Post("/create")
  // createLog(
  //   createLogDto: CreateLogDto,
  //   user: User,
  //   @Ip() ip: string
  // ): Promise<Log> {
  //   createLogDto.ip = ip;
  //   return this.logsService.createLog(createLogDto, user);
  // }

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
