import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { AssignMgService } from "./assign-mg-service";
import { AssignMgCountsResponseDto } from "./dto/response/assign-mg-counts-response.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { UsersService } from "../users/users.service";

@Controller("/assign-mgo")
export class AssignMgController {
  constructor(
    private readonly assignMgService: AssignMgService,
    private readonly userService: UsersService
  ) {}

  @Get("/")
  async pagination(
    @Query() query: MyPaginationQuery,
    @Query("userId") userId?: string
  ) {
    if (userId == null) {
      throw new BadRequestException("userId is required");
    }
    const user = await this.userService.getUserById(userId);
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
