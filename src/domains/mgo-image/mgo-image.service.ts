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
import { MyPagination } from "../base/pagination-response";
import { MgoImageListResponseDto } from "./dto/response/mgo-image-list-response.dto";

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
    options: MyPaginationQuery,
    mgoObjectId?: string,
    statusFlag?: ImageStatusFlag
  ): Promise<Pagination<MgoImageListResponseDto>> {
    const queryBuilder = this.repository.createQueryBuilder("mgoImage");

    if (mgoObjectId) {
      queryBuilder.where("mgoImage.mgId = :mgId", { mgId: mgoObjectId });
    }

    if (statusFlag) {
      queryBuilder.andWhere("mgoImage.statusFlag = :statusFlag", {
        statusFlag,
      });
    }

    const { items, meta } = await paginate<MgoImage>(queryBuilder, options);
    const newItems = items.map((r) => new MgoImageListResponseDto(r));
    return new MyPagination(newItems, meta);
  }

  async updateImageStatus(ids: string[], statusFlag: ImageStatusFlag) {
    await this.dataSource.transaction(async () => {
      await this.repository.update(ids, { statusFlag });
      if (statusFlag === ImageStatusFlag.TEMP) {
        const mgoImage = await this.findOneOrFail(ids[0], ["mgObject"]);
        const mgoObject = mgoImage.mgObject;
        mgoObject.setTransferToTempAtToCurrentDate();
        await this.mgoRepository.save(mgoObject);
      } else if (statusFlag === ImageStatusFlag.OTHER) {
        await this.repository.update(ids, { mgObject: null });
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
