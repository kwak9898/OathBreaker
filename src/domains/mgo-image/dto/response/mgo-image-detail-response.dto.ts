import { PickType } from "@nestjs/swagger";
import { MgoImage } from "../../entities/mgoImage.entity";

export class MgoImageDetailResponseDto extends PickType(MgoImage, [
  "imgId",
  "mgId",
  "statusFlag",
  "imgUrl",
  "cropImgUrl",
]) {}
