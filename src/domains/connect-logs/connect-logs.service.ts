import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConnectLogsRepository } from "./connect-logs.repository";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginateRawAndEntities, Pagination } from "nestjs-typeorm-paginate";
import { ConnectLog } from "./entities/connect-log.entity";
import { User } from "../users/entities/user.entity";
import { MyPagination } from "../base/pagination-response";
import { ConnectLogListResponseDto } from "./dto/connect-log-list-response.dto";

@Injectable()
export class ConnectLogsService {
  constructor(
    @InjectRepository(ConnectLogsRepository)
    private logsRepository: ConnectLogsRepository
  ) {}

  // 접속 로그 전체 조회
  async getAllLogs(
    user: User,
    options: MyPaginationQuery
  ): Promise<Pagination<ConnectLog>> {
    return this.logsRepository.getAllLogs(user, options);
  }

  // 접속 로그 생성
  createLog(
    logId: number,
    url: string,
    ip: string,
    user: User
  ): Promise<ConnectLog> {
    return this.logsRepository.createLog(logId, url, ip, user);
  }

  // 접속 로그 삭제
  deleteLog(logId: number): Promise<void> {
    return this.logsRepository.deleteLog(logId);
  }

  async paginate(
    options: MyPaginationQuery
  ): Promise<Pagination<ConnectLogListResponseDto>> {
    const queryBuilder = this.logsRepository.createQueryBuilder("log");
    queryBuilder.innerJoinAndSelect("log.user", "user");
    const results = await paginateRawAndEntities(queryBuilder, options);
    const entities = results[0];
    const raws = results[1];

    const data = entities.items
      .map((item) => new ConnectLogListResponseDto(item))
      .map((item) => {
        const raw = raws
          .map((r) => r as any)
          .find((raw) => raw.userId == item.userId);
        item.logId = Number(raw.logId);
        item.userId = String(raw.userId);
        item.username = String(raw.username);
        item.ip = String(raw.ip);
        item.url = String(raw.url);
        return item;
      });

    return new MyPagination<ConnectLogListResponseDto>(data, entities.meta);
  }
}
