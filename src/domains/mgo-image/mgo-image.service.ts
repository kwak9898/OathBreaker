import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { ImageStatusFlag, MgoImage } from "./entities/mgoImage.entity";
import { MgoImageRepository } from "./mgo-image.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgObjectRepository } from "../mg-object/mg-object.repository";
import { MGOIMAGE_EXCEPTION } from "../../exception/error-code";
import { DataSource } from "typeorm";
import { MgObject } from "../mg-object/entities/mg-object.entity";

@Injectable()
export class MgoImageService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(MgoImageRepository)
    private repository: MgoImageRepository,
    @InjectRepository(MgObjectRepository)
    private mgoRepository: MgObjectRepository
  ) {}

  async cntForDashboard(): Promise<{ imageTotalCnt: number; tmpCnt: number }> {
    const imageTotalCnt = await this.repository.count();
    const tmpCnt = await this.repository.count({
      where: { statusFlag: ImageStatusFlag.TEMP },
    });
    return { imageTotalCnt, tmpCnt };
  }

  async findOneOrFail(id: string, join?: string[]): Promise<MgoImage> {
    const mgoImage = await this.repository.findOne({
      where: { imgId: id },
      relations: join,
    });
    if (!mgoImage) {
      throw new NotFoundException(MGOIMAGE_EXCEPTION.MGOIMAGE_NOT_FOUND);
    }

    return mgoImage;
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

  async updateImageStatus(ids: string[], isComplete: boolean) {
    const statusFlag = isComplete
      ? ImageStatusFlag.COMPLETED
      : ImageStatusFlag.TEMP;

    await this.dataSource.transaction(async () => {
      await this.repository.update(ids, { statusFlag });
      if (statusFlag === ImageStatusFlag.TEMP) {
        const mgoImage = await this.findOneOrFail(ids[0], ["mgObject"]);
        const mgoObject = mgoImage.mgObject;
        mgoObject.setTransferToTempAtToCurrentDate();
        await this.mgoRepository.save(mgoObject);
      }
    });
  }

  async updateMgObject(imageId: string, mgObject: MgObject): Promise<MgoImage> {
    const imageObject = await this.findOneOrFail(imageId);
    imageObject.mgObject = mgObject;
    imageObject.statusFlag = ImageStatusFlag.COMPLETED;
    return await this.repository.save(imageObject);
  }
}
