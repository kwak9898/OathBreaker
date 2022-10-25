import { MgObjectRepository } from "./mg-object.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { paginateRawAndEntities, Pagination } from "nestjs-typeorm-paginate";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgObjectListResponseDto } from "./dto/response/mgobject-list-response.dto";
import { MyPagination } from "../base/pagination-response";
import { MgObject } from "./entities/mg-object.entity";
import { MgobjectUpdateRequestDto } from "./dto/request/mgobject-update-request.dto";
import { NotFoundException } from "@nestjs/common";
import { MGOBJECT_EXCEPTION } from "../../exception/error-code";
import { MgoImageRepository } from "../mgo-image/mgo-image.repository";
import { MgObjectRecommendListResponseDto } from "./dto/response/mgobject-recommend-list-response.dto";
import { MgobjectAiSearchListResponseDto } from "./dto/response/mgobject-ai-search-list-response.dto";

export class MgObjectService {
  constructor(
    @InjectRepository(MgObjectRepository)
    private repository: MgObjectRepository,
    @InjectRepository(MgoImageRepository)
    private imageRepository: MgoImageRepository
  ) {}

  async totalCount(): Promise<number> {
    return this.repository.count();
  }

  async imageCounts(id: string): Promise<{
    imageTotalCount: number;
    imageTempCount: number;
    imageCompleteCount: number;
    imageInCompleteCount: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder("mgo");
    queryBuilder
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.deleted_at is null)",
        "image_total_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 0 and mgo_image.deleted_at is null)",
        "image_incomplete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 1 and mgo_image.deleted_at is null)",
        "image_complete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 2 and mgo_image.deleted_at is null)",
        "image_temp_cnt"
      )
      .where("mgo.mg_id = :mgId", { mgId: id });

    const counts = await queryBuilder.getRawOne();
    return {
      imageTotalCount: Number(counts.image_total_cnt),
      imageTempCount: Number(counts.image_temp_cnt),
      imageCompleteCount: Number(counts.image_complete_cnt),
      imageInCompleteCount: Number(counts.image_incomplete_cnt),
    };
  }

  async findOneOrFail(id: string): Promise<MgObject> {
    const mgObject = await this.repository.findOne({ where: { mgId: id } });
    if (mgObject == null) {
      throw new NotFoundException(MGOBJECT_EXCEPTION.MGOBJECT_NOT_FOUND);
    }
    return mgObject;
  }

  async update(
    id: string,
    updateDto: MgobjectUpdateRequestDto
  ): Promise<MgObject> {
    const mgObject = await this.findOneOrFail(id);
    if (updateDto.mainMgCategory) {
      mgObject.mainMgCategory = updateDto.mainMgCategory;
    }
    if (updateDto.mediumMgCategory) {
      mgObject.mediumMgCategory = updateDto.mediumMgCategory;
    }
    if (updateDto.subMgCategory) {
      mgObject.subMgCategory = updateDto.subMgCategory;
    }
    if (updateDto.mgName) {
      mgObject.mgName = updateDto.mgName;
    }
    return await this.repository.save(mgObject);
  }

  async paginate(
    options: MyPaginationQuery
  ): Promise<Pagination<MgObjectListResponseDto>> {
    const queryBuilder = this.repository.createQueryBuilder("mgo");
    queryBuilder.where("mgo.deletedAt IS NULL");
    queryBuilder
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.deleted_at is null)",
        "image_total_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 0 and mgo_image.deleted_at is null)",
        "image_incomplete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 1 and mgo_image.deleted_at is null)",
        "image_complete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 2 and mgo_image.deleted_at is null)",
        "image_temp_cnt"
      );

    if (options.search != null) {
      queryBuilder.andWhere(
        "mgo.mg_name ilike :mgName or mgo.mgId = :mgId or mgo.mainMgCategory LIKE :mainMgCategory or mgo.mediumMgCategory LIKE :mediumMgCategory or mgo.subMgCategory LIKE :subMgCategory",
        {
          mgName: `${options.search}%`,
          mgId: options.search,
          mainMgCategory: `${options.search}%`,
          mediumMgCategory: `${options.search}%`,
          subMgCategory: `${options.search}%`,
        }
      );
    }

    const results = await paginateRawAndEntities(queryBuilder, options);
    const entities = results[0];
    const raws = results[1];

    const data = entities.items
      .map((item) => new MgObjectListResponseDto(item))
      .map((item) => {
        const raw = raws
          .map((r) => r as any)
          .find((raw) => raw.mgo_mg_id == item.mgId);
        item.imageTotalCnt = Number(raw.image_total_cnt);
        item.imageIncompleteCnt = Number(raw.image_incomplete_cnt);
        item.imageCompleteCnt = Number(raw.image_complete_cnt);
        item.imageTempCnt = Number(raw.image_temp_cnt);
        return item;
      });

    return new MyPagination<MgObjectListResponseDto>(data, entities.meta);
  }

  async recommendMgObjectFromImage(
    imageId: string
  ): Promise<MgObjectRecommendListResponseDto[]> {
    const mgObjectList = await this.repository.find({});
    const sliceList = mgObjectList.slice(0, 8);
    return sliceList.map((item) => new MgObjectRecommendListResponseDto(item));
  }

  async aiSearch(
    searchQuery: string
  ): Promise<MgobjectAiSearchListResponseDto[]> {
    const mgObjectList = await this.repository.find({});
    const sliceList = mgObjectList.slice(0, 8);
    return sliceList.map((item) => new MgobjectAiSearchListResponseDto(item));
  }
}
