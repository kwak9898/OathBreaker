import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { AssignMgService } from "./assign-mg-service";
import { AssignMgCountsResponseDto } from "./dto/response/assign-mg-counts-response.dto";
import { UsersService } from "../users/users.service";
import { Public } from "../../dacorators/skip-auth.decorator";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AssignMgPaginationQuery } from "./dto/request/assignMgPaginationQuery";
import { ApiPaginatedResponse } from "../../dacorators/paginate.decorator";
import { MgObjectListResponseDto } from "../mg-object/dto/response/mgobject-list-response.dto";

@Controller("/assign-mgo")
@ApiTags("assign-mgo")
@ApiBearerAuth("access-token")
export class AssignMgController {
  constructor(
    private readonly assignMgService: AssignMgService,
    private readonly userService: UsersService
  ) {}

  @Post("/assign/:mgObjectId")
  @Public()
  async assign(@Param("mgObjectId") mgObjectId: string) {
    if (mgObjectId == null) {
      throw new BadRequestException("mgObjectId is required");
    }
    return this.assignMgService.assignMgObjectToAdmin(mgObjectId);
  }

  @Get("/")
  @ApiQuery({
    name: "userId",
    required: true,
    description: "USER ID",
    type: String,
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "작업일 기준 시작일",
    type: Date,
    example: "2022-01-01",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "작업일 기준 완료일",
    type: Date,
    example: "2021-01-31",
  })
  @ApiPaginatedResponse(MgObjectListResponseDto)
  async pagination(@Query() query: AssignMgPaginationQuery) {
    const user = await this.userService.getUserById(query.userId);
    return this.assignMgService.pagination(query, user);
  }

  @Get("/counts")
  @ApiResponse({ type: AssignMgCountsResponseDto })
  async countForDashboard(
    @Query("userId") userId: string
  ): Promise<AssignMgCountsResponseDto> {
    if (userId == null) {
      throw new BadRequestException("userId is required");
    }
    const user = await this.userService.getUserById(userId);
    return this.assignMgService.countForDashboard(user);
  }
}
