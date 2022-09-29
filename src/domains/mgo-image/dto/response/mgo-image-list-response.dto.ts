import { PickType } from "@nestjs/swagger";
import { MgoImage } from "../../entities/mgoImage.entity";
import { pick } from "../../../../utils/dto.utils";

export class MgoImageListResponseDto extends PickType(MgoImage, [
  "imgId",
  "statusFlag",
  "imgUrl",
  "cropImgUrl",
  "isErrorImage",
]) {
  constructor(partial: Partial<MgoImage>) {
    super();
    return pick(partial, [
      "imgId",
      "statusFlag",
      "imgUrl",
      "cropImgUrl",
      "isErrorImage",
    ]);
  }

  isErrorImage = false;
}
