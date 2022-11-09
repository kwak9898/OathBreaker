import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConnectLogsRepository } from "./connect-logs.repository";
import { MyPaginationQuery } from "../base/pagination-query";
import { Pagination } from "nestjs-typeorm-paginate";
import { User } from "../users/entities/user.entity";
import { ConnectLogListResponseDto } from "./dto/connect-log-list-response.dto";
import {
  CONNECT_LOG_EXCEPTION,
  USER_EXCEPTION,
} from "../../exception/error-code";
import { CreateConnectLogResponseDto } from "./dto/createConnectLogResponseDto";

@Injectable()
export class ConnectLogsService {
  constructor(
    @InjectRepository(ConnectLogsRepository)
    private logsRepository: ConnectLogsRepository
  ) {}

  // 접속 로그 전체 조회
  async getAllLogs(
    options: MyPaginationQuery
  ): Promise<Pagination<ConnectLogListResponseDto>> {
    return this.logsRepository.getAllLogs(options);
  }

  // 접속 로그 생성
  async createLog(
    url: string,
    ip: string,
    user: User
  ): Promise<CreateConnectLogResponseDto> {
    if (!user) {
      throw new NotFoundException(USER_EXCEPTION.USER_NOT_FOUND);
    }

    const log = this.logsRepository.create({
      url,
      ip,
      accessAt: new Date(),
      user,
    });

    const persistLog = await this.logsRepository.save(log);

    const dto = new CreateConnectLogResponseDto(persistLog);
    dto.userId = persistLog.user.userId;
    dto.userName = persistLog.user.username;

    return dto;
  }

  // 접속 로그 삭제
  async deleteLog(logId: number): Promise<void> {
    const connectLog = await this.logsRepository.findOne({ where: { logId } });

    if (!connectLog) {
      throw new NotFoundException(CONNECT_LOG_EXCEPTION.CONNECT_LOG_NOT_FOUND);
    }

    await this.logsRepository.delete(logId);
  }
}
