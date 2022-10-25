import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Log } from "./entities/log.entity";
import { CreateLogDto } from "./dto/create-log.dto";
import { User } from "../users/entities/user.entity";
import { UpdateLogDto } from "./dto/update-log.dto";

@Injectable()
export class LogsRepository extends Repository<Log> {
  constructor(private readonly dataSource: DataSource) {
    super(Log, dataSource.createEntityManager());
  }

  // 접속 로그 생성
  async createLog(createLogDto: CreateLogDto, user: User): Promise<Log> {
    const { url, ip, firstAccessAt } = createLogDto;

    const log = await this.create({
      url,
      ip,
      firstAccessAt,
      user,
    });

    await this.save(log);
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
    // TODO 구현하기
  }
}
