import { MgObjectService } from "./mg-object.service";
import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { Public } from "../../dacorators/skip-auth.decorator";
import { MgoImageService } from "../mgo-image/mgo-image.service";
import { CountForDashboardResponseDto } from "./dto/response/count-for-dashboard-response.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgObjectUpdateDto } from "./dto/request/MgObjectUpdateDto";
import { MgobjectDetailResponseDto } from "./dto/response/mgobject-detail-response-dto";

@Controller("/mg-objects")
@Public()
export class MgObjectController {
  constructor(
    private readonly mgObjectService: MgObjectService,
    private readonly mgoImageService: MgoImageService
  ) {}

  @Get("/counts")
  async cntForDashboard(): Promise<CountForDashboardResponseDto> {
    const mgObjectCnt = await this.mgObjectService.totalCount();
    const { imageTotalCnt, tmpCnt } =
      await this.mgoImageService.cntForDashboard();
    return { mgObjectCnt, imageTotalCnt, tmpCnt };
  }

  @Get("")
  async paginate(@Query() query: MyPaginationQuery) {
    return await this.mgObjectService.paginate(query);
  }

  @Get("/:id")
  async findOne(@Param("id") id: string): Promise<MgobjectDetailResponseDto> {
    const mgObject = await this.mgObjectService.findOneOrFail(id);
    const { imageTotalCount, imageTempCount } =
      await this.mgObjectService.imageCounts(id);
    const dto = new MgobjectDetailResponseDto(mgObject);
    dto.imageTotalCnt = imageTotalCount;
    dto.imageTempCnt = imageTempCount;
    return dto;
  }

  @Patch("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateDto: MgObjectUpdateDto
  ): Promise<MgobjectDetailResponseDto> {
    return new MgobjectDetailResponseDto(
      await this.mgObjectService.update(id, updateDto)
    );
  }
}
