import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "../../dacorators/skip-auth.decorator";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgoImageService } from "./mgo-image.service";
import { ImageStatusFlag } from "./entities/mgoImage.entity";

@Controller("/mgo-images")
@Public()
export class MgoImageController {
  constructor(private readonly mgoImageService: MgoImageService) {}

  @Get("/")
  async paginate(
    @Query() query: MyPaginationQuery,
    @Query("mgObjectId") mgObjectId: string,
    @Query("statusFlag") statusFlag?: ImageStatusFlag
  ) {
    return await this.mgoImageService.paginate(mgObjectId, query, statusFlag);
  }
}
