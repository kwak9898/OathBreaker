import { MgObjectRepository } from "./mg-object.repository";
import { InjectRepository } from "@nestjs/typeorm";
import {
  paginate,
  paginateRaw,
  paginateRawAndEntities,
  Pagination,
} from "nestjs-typeorm-paginate";
import { MgObject } from "./entities/mg-object.entity";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgObjectListResponseDto } from "./dto/response/mgobject-list-response";
import { number } from "@hapi/joi";
import { MyPagination } from "../base/pagination-response";

export class MgObjectService {
  constructor(
    @InjectRepository(MgObjectRepository) private repository: MgObjectRepository
  ) {}

  async totalCount(): Promise<number> {
    return this.repository.count();
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
