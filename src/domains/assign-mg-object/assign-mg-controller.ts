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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AssignMgPaginationQuery } from "./dto/request/assignMgPaginationQuery";

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
  async pagination(@Query() query: AssignMgPaginationQuery) {
    const user = await this.userService.getUserById(query.userId);
    return this.assignMgService.pagination(query, user);
  }

  @Get("/counts")
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
