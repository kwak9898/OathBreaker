import { InjectRepository } from "@nestjs/typeorm";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { ImageStatusFlag, MgoImage } from "./entities/mgoImage.entity";
import { MgoImageRepository } from "./mgo-image.repository";
import { Injectable } from "@nestjs/common";
import { MyPaginationQuery } from "../base/pagination-query";

@Injectable()
export class MgoImageService {
  constructor(
    @InjectRepository(MgoImageRepository) private repository: MgoImageRepository
  ) {}

  async cntForDashboard(): Promise<{ imageTotalCnt: number; tmpCnt: number }> {
    const imageTotalCnt = await this.repository.count();
    const tmpCnt = await this.repository.count({
      where: { statusFlag: ImageStatusFlag.TEMP },
    });
    return { imageTotalCnt, tmpCnt };
  }

  async paginate(
    mgoObjectId: string,
    options: MyPaginationQuery,
    statusFlag?: ImageStatusFlag
  ): Promise<Pagination<MgoImage>> {
    const queryBuilder = this.repository
      .createQueryBuilder("mgoImage")
      .where("mgoImage.mgId = :mgId", { mgId: mgoObjectId });

    if (statusFlag) {
      queryBuilder.andWhere("mgoImage.statusFlag = :statusFlag", {
        statusFlag,
      });
    }

    return paginate<MgoImage>(queryBuilder, options);
  }
}
