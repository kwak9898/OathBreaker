import { MgObjectService } from "./mg-object.service";
import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "../../dacorators/skip-auth.decorator";
import { MyPaginationQuery } from "../../dacorators/PaginateQuery";
import { MgoImageService } from "../mgo-image/mgo-image.service";
import { CountForDashboardResponseDto } from "./dto/count-for-dashboard-response.dto";

@Controller("/mg-objects")
export class MgObjectController {
  constructor(
    private readonly mgObjectService: MgObjectService,
    private readonly mgoImageService: MgoImageService
  ) {}

  @Get("counts")
  @Public()
  async cntForDashboard(): Promise<CountForDashboardResponseDto> {
    const mgObjectCnt = await this.mgObjectService.totalCount();
    const { imageCnt, tmpCnt } = await this.mgoImageService.cntForDashboard();
    return { mgObjectCnt, imageCnt, tmpCnt };
  }

  @Get("")
  @Public()
  async paginate(@Query() query: MyPaginationQuery) {
    return await this.mgObjectService.paginate(query);
  }
}
