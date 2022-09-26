import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from "@nestjs/common";
import { Public } from "../../dacorators/skip-auth.decorator";
import { MyPaginationQuery } from "../base/pagination-query";
import { MgoImageService } from "./mgo-image.service";
import { ImageStatusFlag, MgoImage } from "./entities/mgoImage.entity";
import { UpdateMgoImageStatusDto } from "./dto/UpdateMgoImageStatusDto";
import { UpdateMgoImageObjectDto } from "./dto/UpdateMgoImageObjectDto";
import { MgObjectService } from "../mg-object/mg-object.service";

@Controller("/mgo-images")
@Public()
export class MgoImageController {
  constructor(
    private readonly mgoImageService: MgoImageService,
    private readonly mgObjectService: MgObjectService
  ) {}

  @Get("/")
  async paginate(
    @Query() query: MyPaginationQuery,
    @Query("mgObjectId") mgObjectId: string,
    @Query("statusFlag") statusFlag?: ImageStatusFlag
  ) {
    return await this.mgoImageService.paginate(mgObjectId, query, statusFlag);
  }

  @Patch("/status")
  @HttpCode(200)
  async updateStatus(@Body() dto: UpdateMgoImageStatusDto) {
    await this.mgoImageService.updateImageStatus(dto.imageIds, dto.isComplete);
  }

  @Patch("/mgobject")
  async updateMgObject(
    @Body() dto: UpdateMgoImageObjectDto
  ): Promise<MgoImage> {
    const mgObject = await this.mgObjectService.findOneOrFail(dto.mgObjectId);
    return await this.mgoImageService.updateMgObject(dto.imageId, mgObject);
  }

  @Get("/:id/temp")
  async tempList(@Param("id") mgobjectId: string): Promise<MgoImage[]> {
    return await this.mgoImageService.tempList(mgobjectId);
  }
}
