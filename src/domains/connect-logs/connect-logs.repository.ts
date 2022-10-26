import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ConnectLog } from "./entities/connect-log.entity";
import { User } from "../users/entities/user.entity";
import { UpdateLogDto } from "./dto/update-log.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class ConnectLogsRepository extends Repository<ConnectLog> {
  constructor(private readonly dataSource: DataSource) {
    super(ConnectLog, dataSource.createEntityManager());
  }

  // 접속 로그 전체 조회
  async getAllLogs(
    user: User,
    options: MyPaginationQuery
  ): Promise<Pagination<ConnectLog>> {
    const query = this.createQueryBuilder("log");

    const logs = query.innerJoinAndSelect("log.user", "user");
    const pagination = paginate(logs, options);
    return pagination;
  }

  // 접속 로그 생성
  async createLog(
    logId: number,
    url: string,
    ip: string,
    user: User
  ): Promise<ConnectLog> {
    const log = await this.create({
      url,
      ip,
      accessAt: new Date(),
      user,
    });
    return await this.save(log);
  }

  // 접속 로그 수정
  async updateLog(
    logId: number,
    user: User,
    updateLogDto: UpdateLogDto
  ): Promise<ConnectLog> {
    const { url, ip, firstAccessAt } = updateLogDto;
    const existLogByUser = await this.findOne({ where: { logId } });

    if (!existLogByUser) {
      throw new NotFoundException("존재하는 로그가 없습니다.");
    }

    await this.update(logId, { url, ip, accessAt: firstAccessAt });
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
