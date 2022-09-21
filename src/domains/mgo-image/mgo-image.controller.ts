import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "../../dacorators/skip-auth.decorator";
import { MyPaginationQuery } from "../../dacorators/PaginateQuery";
import { MgoImageService } from "./mgo-image.service";

@Controller("/mgo-images")
export class MgoImageController {
  constructor(private readonly mgoImageService: MgoImageService) {}

  @Get("")
  @Public()
  async paginate(@Query() query: MyPaginationQuery) {
    return await this.mgoImageService.paginate(query);
  }
}
