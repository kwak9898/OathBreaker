import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConnectLogsRepository } from "./connect-logs.repository";
import { MyPaginationQuery } from "../base/pagination-query";
import { Pagination } from "nestjs-typeorm-paginate";
import { ConnectLog } from "./entities/connect-log.entity";
import { User } from "../users/entities/user.entity";
import { ConnectLogListResponseDto } from "./dto/connect-log-list-response.dto";

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
  createLog(url: string, ip: string, user: User): Promise<ConnectLog> {
    return this.logsRepository.createLog(url, ip, user);
  }

  // 접속 로그 삭제
  deleteLog(logId: number): Promise<void> {
    return this.logsRepository.deleteLog(logId);
  }
}
