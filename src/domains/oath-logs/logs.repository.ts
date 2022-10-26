import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Log } from "./entities/log.entity";
import { CreateLogDto } from "./dto/create-log.dto";
import { User } from "../users/entities/user.entity";
import { UpdateLogDto } from "./dto/update-log.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class LogsRepository extends Repository<Log> {
  constructor(private readonly dataSource: DataSource) {
    super(Log, dataSource.createEntityManager());
  }

  // 접속 로그 전체 조회
  async getAllLogs(
    user: User,
    options: MyPaginationQuery
  ): Promise<Pagination<Log>> {
    const query = this.createQueryBuilder("log");

    const logs = query.where("log.userId = :userId, log.username = :username", {
      userId: user.userId,
      username: user.username,
    });
    const pagination = paginate(logs, options);
    return pagination;
  }

  // 접속 로그 생성
  async createLog(
    createLogDto: CreateLogDto,
    user: User,
    userId: string
  ): Promise<Log> {
    const { logId, url, ip, firstAccessAt } = createLogDto;
    const existLogId = await this.findOne({ where: { logId } });
    userId = user.userId;

    // const log = await this.create({
    //   url,
    //   ip,
    //   firstAccessAt,
    //   user,
    // });
    const log = await this.update(userId, { url, ip, firstAccessAt });
    return log;
  }

  // 접속 로그 수정
  async updateLog(
    logId: number,
    user: User,
    updateLogDto: UpdateLogDto
  ): Promise<Log> {
    const { url, ip, firstAccessAt } = updateLogDto;
    const existLogByUser = await this.findOne({ where: { logId } });

    if (!existLogByUser) {
      throw new NotFoundException("존재하는 로그가 없습니다.");
    }

    await this.update(logId, { url, ip, firstAccessAt });
    return;
  }

  // 접속 로그 삭제
  async deleteLog(logId: number): Promise<void> {
    const log = await this.findOne({ where: { logId } });

    if (!log) {
      throw new NotFoundException("유저의 로그가 존재하지 않습니다.");
    }

    await this.delete(logId);
  }
}
