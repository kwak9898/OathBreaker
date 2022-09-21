import { MgObjectService } from "./mg-object.service";
import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "../../dacorators/skip-auth.decorator";
import { IPaginationOptions } from "nestjs-typeorm-paginate/dist/interfaces";

@Controller("/mg-objects")
export class MgObjectController {
  constructor(private readonly mgObjectService: MgObjectService) {}

  @Get("")
  @Public()
  async pagination(@Query() query: IPaginationOptions) {
    return await this.mgObjectService.paginate(query);
  }
}
