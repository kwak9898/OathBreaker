import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ConnectLog } from "./entities/connect-log.entity";
import { User } from "../users/entities/user.entity";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { ConnectLogListResponseDto } from "./dto/connect-log-list-response.dto";
import { MyPagination } from "../base/pagination-response";

@Injectable()
export class ConnectLogsRepository extends Repository<ConnectLog> {
  constructor(private readonly dataSource: DataSource) {
    super(ConnectLog, dataSource.createEntityManager());
  }

  // 접속 로그 전체 조회
  async getAllLogs(
    options: MyPaginationQuery
  ): Promise<Pagination<ConnectLogListResponseDto>> {
    const query = await this.createQueryBuilder("log");
    query.innerJoinAndSelect("log.user", "user");
    const results = await paginate(query, options);

    const data = results.items.map((item) => {
      const dto = new ConnectLogListResponseDto(item);
      dto.userId = item.user.userId;
      dto.userName = item.user.username;
      return dto;
    });

    return new MyPagination<ConnectLogListResponseDto>(data, results.meta);
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

  // 접속 로그 삭제
  async deleteLog(logId: number): Promise<void> {
    const log = await this.findOne({ where: { logId } });

    if (!log) {
      throw new NotFoundException("유저의 로그가 존재하지 않습니다.");
    }

    await this.delete(logId);
  }
}
