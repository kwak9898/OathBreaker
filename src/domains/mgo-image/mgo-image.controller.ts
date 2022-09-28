import { Body, Controller, Get, Patch, Query } from "@nestjs/common";
import { Public } from "../../dacorators/skip-auth.decorator";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgoImageService } from "./mgo-image.service";
import { ImageStatusFlag, MgoImage } from "./entities/mgoImage.entity";
import { UpdateMgoImageStatusDto } from "./dto/request/update-mgo-image-status.dto";
import { UpdateMgoImageMgObjectDto } from "./dto/request/update-mgo-image-mg-object.dto";
import { MgObjectService } from "../mg-object/mg-object.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  ApiPaginatedResponse,
  ApiPaginateQuery,
} from "../../dacorators/paginate.decorator";
import { MgoImagePaginationQueryRequestDto } from "./dto/request/mgo-image-pagination-query-request.dto";
import { MyPagination } from "../base/pagination-response";
import { MgoImageListResponseDto } from "./dto/response/mgo-image-list-response.dto";

@Controller("/mgo-images")
@Public()
@ApiTags("MG-OBJECT-IMAGE")
export class MgoImageController {
  constructor(
    private readonly mgoImageService: MgoImageService,
    private readonly mgObjectService: MgObjectService
  ) {}

  @Get("/")
  @ApiPaginateQuery()
  @ApiOperation({ summary: "PAGING" })
  @ApiQuery({
    enum: ImageStatusFlag,
    example: [
      ImageStatusFlag.INCOMPLETED,
      ImageStatusFlag.COMPLETED,
      ImageStatusFlag.TEMP,
      ImageStatusFlag.OTHER,
    ],
    name: "statusFlag",
    required: false,
  })
  @ApiQuery({
    name: "mgObjectId",
    required: false,
    description: "MG-OBJECT ID",
  })
  @ApiPaginatedResponse(MgoImageListResponseDto)
  async paginate(
    @Query() query: MyPaginationQuery,
    @Query() queryParams?: MgoImagePaginationQueryRequestDto
  ): Promise<MyPagination<MgoImageListResponseDto>> {
    const { items, meta } = await this.mgoImageService.paginate(
      query,
      queryParams.mgObjectId,
      queryParams.statusFlag
    );
    const newItems = this.listMap(items);
    return new MyPagination(newItems, meta);
  }

  /**
   * 선택한 IMAGE들의 상태값을 변경합니다.
   * IMAGE_STATUS = INCOMPLETED(0), COMPLETED(1), TEMP(2), OTHER(3)
   */
  @Patch("/status")
  @ApiOperation({
    summary: "UPDATE STATUS",
  })
  async updateStatus(@Body() dto: UpdateMgoImageStatusDto): Promise<void> {
    await this.mgoImageService.updateImageStatus(dto.imageIds, dto.statusFlag);
  }

  /**
   * 선택한 IMAGE의 MG-OBJCET를 변경합니다.
   */
  @Patch("/mgobject")
  @ApiOperation({
    summary: "UPDATE MGOBJECT",
  })
  @ApiResponse({ type: MgoImage })
  async updateMgObject(
    @Body() dto: UpdateMgoImageMgObjectDto
  ): Promise<MgoImage> {
    const mgObject = await this.mgObjectService.findOneOrFail(dto.mgObjectId);
    return await this.mgoImageService.updateMgObject(dto.imageId, mgObject);
  }

  private listMap(items: MgoImage[]) {
    return items.map((r) => new MgoImageListResponseDto(r));
  }
}
