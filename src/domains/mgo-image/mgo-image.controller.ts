import { Body, Controller, Get, Patch, Query, UseGuards } from "@nestjs/common";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgoImageService } from "./mgo-image.service";
import { ImageStatusFlag, MgoImage } from "./entities/mgoImage.entity";
import { UpdateMgoImageStatusDto } from "./dto/request/update-mgo-image-status.dto";
import { UpdateMgoImageMgObjectDto } from "./dto/request/update-mgo-image-mg-object.dto";
import { MgObjectService } from "../mg-object/mg-object.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  ApiPaginatedResponse,
  ApiPaginateQuery,
} from "../../dacorators/paginate.decorator";
import { MgoImagePaginationQueryRequestDto } from "./dto/request/mgo-image-pagination-query-request.dto";
import { MyPagination } from "../base/pagination-response";
import { MgoImageListResponseDto } from "./dto/response/mgo-image-list-response.dto";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../roles/enum/role.enum";
import { RolesGuard } from "../../guards/roles.guard";

@Controller("/mgo-images")
@ApiTags("MG-OBJECT-IMAGE")
@UseGuards(RolesGuard)
@ApiBearerAuth("access-token")
export class MgoImageController {
  constructor(
    private readonly mgoImageService: MgoImageService,
    private readonly mgObjectService: MgObjectService
  ) {}

  /**
   * Paging
   * @param query
   * @param queryParams
   */
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
  @Roles(Role.admin)
  async paginate(
    @Query() query: MyPaginationQuery,
    @Query() queryParams?: MgoImagePaginationQueryRequestDto
  ): Promise<MyPagination<MgoImageListResponseDto>> {
    return this.mgoImageService.paginate(
      query,
      queryParams.mgObjectId,
      queryParams.statusFlag
    );
  }

  /**
   * 선택한 IMAGE들의 상태값을 변경합니다.
   * IMAGE_STATUS = INCOMPLETED(0), COMPLETED(1), TEMP(2), OTHER(3)
   */
  @Patch("/status")
  @ApiOperation({
    summary: "UPDATE STATUS",
  })
  @Roles(Role.admin)
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
  @Roles(Role.admin)
  async updateMgObject(
    @Body() dto: UpdateMgoImageMgObjectDto
  ): Promise<MgoImage> {
    const mgObject = await this.mgObjectService.findOneOrFail(dto.mgObjectId);
    return await this.mgoImageService.updateMgObject(dto.imageId, mgObject);
  }
}
