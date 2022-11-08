import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesGuard } from "../../guards/roles.guard";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { RoleEntity } from "./entities/role.entity";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "./enum/role.enum";
import { CreateRoleDto } from "./dto/create-role.dto";
import { MyPaginationQuery } from "../base/pagination-query";
import { Pagination } from "nestjs-typeorm-paginate";
import { ApiPaginatedResponse } from "../../dacorators/paginate.decorator";
import { UpdateRoleDto } from "./dto/updateRole.dto";

@Controller("roles")
@UseGuards(RolesGuard)
@ApiTags("ROLES")
@ApiBearerAuth("access-token")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  /**
   * 역할 전체 조회
   */
  @Roles(Role.admin)
  @Get("")
  @ApiPaginatedResponse(RoleEntity)
  @ApiOperation({
    summary: "역할 전체 조회",
  })
  getAllRoles(
    @Query() query: MyPaginationQuery
  ): Promise<Pagination<RoleEntity>> {
    return this.rolesService.getAllRoles(query);
  }

  /**
   * 역할 생성
   */
  @Roles(Role.admin)
  @Post("")
  @ApiOkResponse({ type: RoleEntity })
  @ApiOperation({
    summary: "역할 생성",
  })
  @HttpCode(200)
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRoleDto);
  }

  /**
   * 역할 수정
   */
  @Roles(Role.admin)
  @Patch(":roleId")
  @ApiOkResponse({ type: RoleEntity })
  @ApiOperation({
    summary: "역할 수정",
  })
  async updateRole(
    @Param("roleId") roleId: number,
    @Body() dto: UpdateRoleDto
  ): Promise<RoleEntity> {
    return await this.rolesService.updateRole(roleId, dto.roleName);
  }

  /**
   * 역할 삭제
   */
  @Roles(Role.admin)
  @Delete(":roleId")
  @ApiOperation({
    summary: "역할 삭제",
  })
  deleteRole(@Param("roleId") roleId: number): Promise<void> {
    return this.rolesService.deleteRole(roleId);
  }
}
