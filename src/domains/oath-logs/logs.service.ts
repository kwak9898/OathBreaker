import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LogsRepository } from "./logs.repository";
import { MyPaginationQuery } from "../base/pagination-query";
import { Pagination } from "nestjs-typeorm-paginate";
import { ConnectLog } from "./entities/log.entity";
import { User } from "../users/entities/user.entity";
import { UpdateLogDto } from "./dto/update-log.dto";

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogsRepository)
    private logsRepository: LogsRepository
  ) {}

  // 접속 로그 전체 조회
  async getAllLogs(
    user: User,
    options: MyPaginationQuery
  ): Promise<Pagination<ConnectLog>> {
    return this.getAllLogs(user, options);
  }

  // 접속 로그 생성
  // createLog(createLogDto: CreateLogDto, user: User): Promise<Log> {
  //   return this.logsRepository.createLog(createLogDto, user);
  // }

  // 접속 로그 수정
  updateLog(
    logId: number,
    user: User,
    updateLogDto: UpdateLogDto
  ): Promise<ConnectLog> {
    return this.logsRepository.updateLog(logId, user, updateLogDto);
  }

  // 접속 로그 삭제
  deleteLog(logId: number): Promise<void> {
    return this.logsRepository.deleteLog(logId);
  }
}
