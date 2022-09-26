import { ArrayNotEmpty, IsArray, IsNotEmpty } from "class-validator";
import { ImageStatusFlag } from "../entities/mgoImage.entity";

export class UpdateMgoImageStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  imageIds: string[];

  @IsNotEmpty()
  statusFlag: ImageStatusFlag;
}
