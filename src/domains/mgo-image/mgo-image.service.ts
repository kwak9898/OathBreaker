import { InjectRepository } from "@nestjs/typeorm";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { MyPaginationQuery } from "../../dacorators/PaginateQuery";
import { MgoImage } from "./entities/mgoImage.entity";
import { MgoImageRepository } from "./mgo-image.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MgoImageService {
  constructor(
    @InjectRepository(MgoImageRepository) private repository: MgoImageRepository
  ) {}

  async cntForDashboard(): Promise<{ imageCnt: number; tmpCnt: number }> {
    const imageCnt = await this.repository.count();
    const tmpCnt = await this.repository.count({ where: { statusFlag: 2 } });
    return { imageCnt, tmpCnt };
  }

  async paginate(options: MyPaginationQuery): Promise<Pagination<MgoImage>> {
    const queryBuilder = this.repository
      .createQueryBuilder("mgObject")
      .where("mgObject.mgName = :mgName", { mgName: options.search })
      .orWhere("mgObject.mgId = :mgId", { mgId: options.search });
    return paginate<MgoImage>(queryBuilder, options);
  }
}
