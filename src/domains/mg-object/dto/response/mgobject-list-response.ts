import { MgObject } from "../../entities/mg-object.entity";
import { omit } from "../../../../utils/dto.utils";
import { OmitType } from "@nestjs/swagger";

export class MgObjectListResponseDto extends OmitType(MgObject, [
  "likeRank",
  "likeCnt",
  "rankChange",
  "mgoImages",
  "updatedAt",
  "deletedAt",
  "isActive",
]) {
  constructor(partial?: Partial<MgObject>) {
    super();
    return omit(partial, [
      "likeRank",
      "likeCnt",
      "rankChange",
      "mgoImages",
      "updatedAt",
      "deletedAt",
      "isActive",
    ]);
  }

  imageTotalCnt: number;
  imageIncompleteCnt: number;
  imageCompleteCnt: number;
  imageTempCnt: number;
}
