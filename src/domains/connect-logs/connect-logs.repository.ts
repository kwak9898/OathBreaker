import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ConnectLog } from "./entities/connect-log.entity";
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
    const query = await this.createQueryBuilder("logList");
    query.innerJoinAndSelect("logList.user", "user");
    const results = await paginate(query, options);

    const data = results.items.map((item) => {
      const dto = new ConnectLogListResponseDto(item);
      dto.userId = item.user.userId;
      dto.userName = item.user.username;
      return dto;
    });

    return new MyPagination<ConnectLogListResponseDto>(data, results.meta);
  }
}
