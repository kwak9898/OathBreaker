import { MgObjectService } from "./mg-object.service";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MgoImageService } from "../mgo-image/mgo-image.service";
import { CountForDashboardResponseDto } from "./dto/response/count-for-dashboard-response.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgobjectUpdateRequestDto } from "./dto/request/mgobject-update-request.dto";
import { MgobjectDetailResponseDto } from "./dto/response/mgobject-detail-response.dto";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import {
  ApiPaginatedResponse,
  ApiPaginateQuery,
  ApiPaginateQueryInterface,
} from "../../dacorators/paginate.decorator";
import { Pagination } from "nestjs-typeorm-paginate";
import { MgObjectListResponseDto } from "./dto/response/mgobject-list-response.dto";
import { MgObjectRecommendListResponseDto } from "./dto/response/mgobject-recommend-list-response.dto";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../roles/enum/role.enum";
import { MgobjectAiSearchListResponseDto } from "./dto/response/mgobject-ai-search-list-response.dto";

const MgoImagePaginationQueryData: ApiPaginateQueryInterface = {
  searchColumns: [
    "ID",
    "MG_NAME",
    "대분류(main_mg_category)",
    "중분류(medium_mg_category)",
    "소분류(sub_mg_category)",
  ],
};

@Controller("/mg-objects")
@ApiTags("MG-OBJECT")
@UseGuards(RolesGuard)
export class MgObjectController {
  constructor(
    private readonly mgObjectService: MgObjectService,
    private readonly mgoImageService: MgoImageService
  ) {}

  @Get("/counts")
  @ApiOperation({ summary: "COUNTS FOR DASHBOARD" })
  @ApiOkResponse({ type: CountForDashboardResponseDto })
  @Roles(Role.admin)
  async cntForDashboard(): Promise<CountForDashboardResponseDto> {
    const mgObjectCnt = await this.mgObjectService.totalCount();
    const { imageTotalCnt, tmpCnt } =
      await this.mgoImageService.cntForDashboard();
    return { mgObjectCnt, imageTotalCnt, tmpCnt };
  }

  @Get("")
  @ApiPaginateQuery(MgoImagePaginationQueryData)
  @ApiOperation({ summary: "PAGING" })
  @ApiPaginatedResponse(MgObjectListResponseDto)
  @Roles(Role.admin)
  async paginate(
    @Query() query: MyPaginationQuery
  ): Promise<Pagination<MgObjectListResponseDto>> {
    return await this.mgObjectService.paginate(query);
  }

  @Get("/:id")
  @ApiOperation({ summary: "DETAIL" })
  @ApiOkResponse({ type: MgobjectUpdateRequestDto })
  @Roles(Role.admin)
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
  @ApiOperation({ summary: "UPDATE" })
  @ApiOkResponse({ type: MgobjectUpdateRequestDto })
  @Roles(Role.admin)
  async update(
    @Param("id") id: string,
    @Body() updateDto: MgobjectUpdateRequestDto
  ): Promise<MgobjectDetailResponseDto> {
    return new MgobjectDetailResponseDto(
      await this.mgObjectService.update(id, updateDto)
    );
  }

  /**
   * MG-OBJECT-ID 리스트를 검색 합니다
   */
  @Get("/ai/search")
  @ApiOperation({ summary: "AI SEARCH MG-OBJECT" })
  @ApiParam({ name: "query", type: "string" })
  @Roles(Role.admin)
  async search(
    @Param("query") searchQuery: string
  ): Promise<MgobjectAiSearchListResponseDto[]> {
    return this.mgObjectService.aiSearch(searchQuery);
  }

  /**
   * TEMP IMAGE에 맞는 추천 MG-OBJECT-ID 리스트를 조회 합니다
   */
  @Get("/ai/recommend/:imageId")
  @ApiOperation({ summary: "추천 MG-OBJECT" })
  @ApiParam({ name: "imageId", type: "string" })
  @Roles(Role.admin)
  async recommend(
    @Param("imageId") imageId: string
  ): Promise<MgObjectRecommendListResponseDto[]> {
    return this.mgObjectService.recommendMgObjectFromImage(imageId);
  }
}
