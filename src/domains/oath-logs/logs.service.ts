import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LogsRepository } from "./logs.repository";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { Log } from "./entities/log.entity";
import { CreateLogDto } from "./dto/create-log.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogsRepository)
    private logsRepository: LogsRepository
  ) {}

  // 접속 로그 전체 조회
  async getAllLogs(options: MyPaginationQuery): Promise<Pagination<Log>> {
    return paginate(await this.logsRepository, options);
  }

  // 접속 로그 생성
  createLog(createLogDto: CreateLogDto, user: User): Promise<Log> {
    return this.logsRepository.createLog(createLogDto, user);
  }
}
