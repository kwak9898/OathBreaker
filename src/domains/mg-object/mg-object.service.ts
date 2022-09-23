import { MgObjectRepository } from "./mg-object.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { paginateRawAndEntities, Pagination } from "nestjs-typeorm-paginate";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgObjectListResponseDto } from "./dto/response/mgobject-list-response";
import { MyPagination } from "../base/pagination-response";
import { MgObject } from "./entities/mg-object.entity";
import { MgObjectUpdateDto } from "./dto/request/MgObjectUpdateDto";
import { NotFoundException } from "@nestjs/common";
import { MGOBJECT_EXCEPTION } from "../../exception/error-code";
import { MgoImageRepository } from "../mgo-image/mgo-image.repository";

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
    imageUnCompleteCount: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder("mgo");
    queryBuilder
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id)",
        "image_total_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 0)",
        "image_uncomplete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 1)",
        "image_complete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 2)",
        "image_temp_cnt"
      )
      .where("mgo.mg_id = :mgId", { mgId: id });

    const counts = await queryBuilder.getRawOne();
    return {
      imageTotalCount: Number(counts.image_total_cnt),
      imageTempCount: Number(counts.image_temp_cnt),
      imageCompleteCount: Number(counts.image_complete_cnt),
      imageUnCompleteCount: Number(counts.image_uncomplete_cnt),
    };
  }

  async findOneOrFail(id: string): Promise<MgObject> {
    const mgObject = await this.repository.findOne({ where: { mgId: id } });
    if (mgObject == null) {
      throw new NotFoundException(MGOBJECT_EXCEPTION.MGOBJECT_NOT_FOUND);
    }
    return mgObject;
  }

  async update(id: string, updateDto: MgObjectUpdateDto): Promise<MgObject> {
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
    return await this.repository.save(mgObject);
  }

  async paginate(
    options: MyPaginationQuery
  ): Promise<Pagination<MgObjectListResponseDto>> {
    const queryBuilder = this.repository.createQueryBuilder("mgo");
    queryBuilder
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id)",
        "image_total_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 0)",
        "image_incomplete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 1)",
        "image_complete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = mgo.mg_id and mgo_image.status_flag = 2)",
        "image_temp_cnt"
      );

    if (options.search) {
      queryBuilder
        .where("mgo.mgName = :mgName", { mgName: options?.search ?? "" })
        .orWhere("mgo.mgId = :mgId", { mgId: options?.search ?? "" });
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
        item.image_total_cnt = Number(raw.image_total_cnt);
        item.image_incomplete_cnt = Number(raw.image_incomplete_cnt);
        item.image_complete_cnt = Number(raw.image_complete_cnt);
        item.image_temp_cnt = Number(raw.image_temp_cnt);
        return item;
      });

    return new MyPagination<MgObjectListResponseDto>(data, entities.meta);
  }
}
